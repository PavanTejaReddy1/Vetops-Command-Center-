import { useEffect, useState } from 'react';
import { Sparkles, Plus, Trash2, Copy, Download, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar } from '../../components/ui/FilterBar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useDisclosure } from '../../hooks/useDisclosure';
import { predictionsApi } from '../../lib/api/predictions';
import { formatDate, formatTime } from '../../lib/utils/formatters';

const RISK_VARIANT = { Critical: 'rose', High: 'amber', Medium: 'blue', Low: 'neutral' };
const RISK_OPTIONS = [
  { label: 'Critical', value: 'Critical' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
];

const SPECIES_OPTIONS = [
  { label: 'Dog', value: 'Dog' },
  { label: 'Cat', value: 'Cat' },
  { label: 'Bird', value: 'Bird' },
  { label: 'Reptile', value: 'Reptile' },
  { label: 'Small Mammal', value: 'Small Mammal' },
  { label: 'Other', value: 'Other' },
];

function PredictionFormModal({ isOpen, onClose, onSubmit, isSubmitting, isProcessing }) {
  const [formData, setFormData] = useState({
    predictionId: '',
    animalName: '',
    species: 'Dog',
    breed: '',
    age: '',
    weight: '',
    gender: 'Unknown',
    symptoms: '',
    medicalHistory: '',
    currentMedications: '',
    bodyTemperature: '',
    heartRate: '',
    respiratoryRate: '',
    laboratoryResults: '',
    additionalNotes: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        predictionId: '',
        animalName: '',
        species: 'Dog',
        breed: '',
        age: '',
        weight: '',
        gender: 'Unknown',
        symptoms: '',
        medicalHistory: '',
        currentMedications: '',
        bodyTemperature: '',
        heartRate: '',
        respiratoryRate: '',
        laboratoryResults: '',
        additionalNotes: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      age: formData.age ? parseFloat(formData.age) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      bodyTemperature: formData.bodyTemperature ? parseFloat(formData.bodyTemperature) : undefined,
      heartRate: formData.heartRate ? parseFloat(formData.heartRate) : undefined,
      respiratoryRate: formData.respiratoryRate ? parseFloat(formData.respiratoryRate) : undefined,
    };
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Veterinary Prediction"
      description="Enter patient data for AI-powered diagnostic prediction"
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting || isProcessing}>
            {isProcessing ? 'Processing with AI...' : 'Generate Prediction'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Prediction ID *</label>
            <Input
              value={formData.predictionId}
              onChange={(e) => setFormData({ ...formData, predictionId: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Animal Name *</label>
            <Input
              value={formData.animalName}
              onChange={(e) => setFormData({ ...formData, animalName: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Species *</label>
            <select
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            >
              {SPECIES_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Breed</label>
            <Input
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Age (years)</label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Weight (kg)</label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Unknown">Unknown</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Symptoms *</label>
          <textarea
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            rows="2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Medical History</label>
          <textarea
            value={formData.medicalHistory}
            onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
            className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            rows="2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Current Medications</label>
          <textarea
            value={formData.currentMedications}
            onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
            className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            rows="2"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Body Temperature (°C)</label>
            <Input
              type="number"
              step="0.1"
              value={formData.bodyTemperature}
              onChange={(e) => setFormData({ ...formData, bodyTemperature: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Heart Rate (bpm)</label>
            <Input
              type="number"
              min="0"
              value={formData.heartRate}
              onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Respiratory Rate</label>
            <Input
              type="number"
              min="0"
              value={formData.respiratoryRate}
              onChange={(e) => setFormData({ ...formData, respiratoryRate: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Laboratory Results</label>
          <textarea
            value={formData.laboratoryResults}
            onChange={(e) => setFormData({ ...formData, laboratoryResults: e.target.value })}
            className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            rows="2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Additional Notes</label>
          <textarea
            value={formData.additionalNotes}
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            rows="2"
          />
        </div>
      </form>
    </Modal>
  );
}

function PredictionResultModal({ isOpen, onClose, prediction, onExport, onCopy }) {
  if (!prediction) return null;

  const aiResult = prediction.aiResult;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`AI Prediction for ${prediction.animalName}`}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="secondary" icon={Copy} onClick={() => onCopy(prediction)}>Copy</Button>
          <Button icon={Download} onClick={() => onExport(prediction)}>Export</Button>
        </>
      }
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        <div className="flex items-center gap-2">
          <Badge variant={RISK_VARIANT[aiResult?.riskLevel] || 'neutral'}>{aiResult?.riskLevel || 'Unknown'}</Badge>
          <span className="text-sm text-ink-faint">Confidence: {aiResult?.confidenceScore || 0}%</span>
        </div>

        {aiResult?.possibleConditions && aiResult.possibleConditions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-ink mb-2">Possible Conditions</h4>
            <ul className="space-y-1">
              {aiResult.possibleConditions.map((cond, idx) => (
                <li key={idx} className="text-sm text-ink-muted flex justify-between">
                  <span>{cond.condition}</span>
                  <span className="text-ink-faint">{cond.likelihood}% likelihood</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {aiResult?.recommendedTests && aiResult.recommendedTests.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-ink mb-2">Recommended Tests</h4>
            <ul className="space-y-1">
              {aiResult.recommendedTests.map((test, idx) => (
                <li key={idx} className="text-sm text-ink-muted">• {test}</li>
              ))}
            </ul>
          </div>
        )}

        {aiResult?.immediateCareSuggestions && aiResult.immediateCareSuggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-ink mb-2">Immediate Care Suggestions</h4>
            <ul className="space-y-1">
              {aiResult.immediateCareSuggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-ink-muted">• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {aiResult?.recommendedTreatments && aiResult.recommendedTreatments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-ink mb-2">Recommended Treatments</h4>
            <ul className="space-y-1">
              {aiResult.recommendedTreatments.map((treatment, idx) => (
                <li key={idx} className="text-sm text-ink-muted">• {treatment}</li>
              ))}
            </ul>
          </div>
        )}

        {aiResult?.followUpAdvice && (
          <div>
            <h4 className="text-sm font-semibold text-ink mb-2">Follow-up Advice</h4>
            <p className="text-sm text-ink-muted">{aiResult.followUpAdvice}</p>
          </div>
        )}

        {aiResult?.preventiveRecommendations && aiResult.preventiveRecommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-ink mb-2">Preventive Recommendations</h4>
            <ul className="space-y-1">
              {aiResult.preventiveRecommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-ink-muted">• {rec}</li>
              ))}
            </ul>
          </div>
        )}

        {aiResult?.aiExplanation && (
          <div>
            <h4 className="text-sm font-semibold text-ink mb-2">AI Explanation</h4>
            <p className="text-sm text-ink-muted">{aiResult.aiExplanation}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function PredictionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('all');
  const [riskLevel, setRiskLevel] = useState('all');
  const [page, setPage] = useState(1);
  const [predictions, setPredictions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const formModal = useDisclosure();
  const resultModal = useDisclosure();

  const fetchPredictions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { search, page };
      if (species !== 'all') params.species = species;
      if (riskLevel !== 'all') params.riskLevel = riskLevel;
      const result = await predictionsApi.list(params);
      setPredictions(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch predictions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, species, riskLevel]);

  useEffect(() => {
    fetchPredictions();
  }, [search, species, riskLevel, page]);

  const handleAdd = () => {
    formModal.open();
  };

  const handleViewResult = (prediction) => {
    setSelectedPrediction(prediction);
    resultModal.open();
  };

  const handleDelete = (prediction) => {
    setSelectedPrediction(prediction);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await predictionsApi.remove(selectedPrediction._id);
      setDeleteConfirmOpen(false);
      setSelectedPrediction(null);
      fetchPredictions();
    } catch (err) {
      setError(err.message || 'Failed to delete prediction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setIsProcessing(true);
      await predictionsApi.create(formData);
      formModal.close();
      setIsProcessing(false);
      fetchPredictions();
    } catch (err) {
      setError(err.message || 'Failed to create prediction');
      setIsProcessing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (prediction) => {
    const text = `AI Prediction for ${prediction.animalName}\n\n` +
      `Risk Level: ${prediction.aiResult?.riskLevel}\n` +
      `Confidence: ${prediction.aiResult?.confidenceScore}%\n\n` +
      `Possible Conditions:\n${prediction.aiResult?.possibleConditions?.map(c => `- ${c.condition} (${c.likelihood}%)`).join('\n')}\n\n` +
      `AI Explanation:\n${prediction.aiResult?.aiExplanation}`;
    
    navigator.clipboard.writeText(text);
  };

  const handleExport = (prediction) => {
    const data = JSON.stringify(prediction, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prediction-${prediction.predictionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Predictions"
        description="AI-generated veterinary diagnostic predictions powered by Groq."
        actions={
          <Button icon={Plus} onClick={handleAdd}>
            New Prediction
          </Button>
        }
      />

      <Card padded={false}>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search animal or prediction ID…" className="sm:max-w-xs" />
          <FilterBar
            filters={[
              { id: 'species', label: 'Species', value: species, options: SPECIES_OPTIONS, onChange: setSpecies },
              { id: 'riskLevel', label: 'Risk Level', value: riskLevel, options: RISK_OPTIONS, onChange: setRiskLevel },
            ]}
            onClearAll={() => {
              setSpecies('all');
              setRiskLevel('all');
            }}
          />
        </div>

        <div className="p-4">
          {isLoading ? (
            <LoadingSkeleton variant="list" rows={4} />
          ) : predictions.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No predictions found"
              description="Create a new prediction to get AI-powered diagnostic insights."
            />
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {predictions.map((prediction) => (
                  <li key={prediction._id} className="rounded-lg border border-border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3">
                        <Badge variant={RISK_VARIANT[prediction.aiResult?.riskLevel] || 'neutral'} className="mt-0.5 shrink-0">
                          {prediction.aiResult?.riskLevel || 'Unknown'}
                        </Badge>
                        <div>
                          <p className="font-display text-sm font-semibold text-ink">{prediction.animalName}</p>
                          <p className="mt-1 text-sm text-ink-muted">
                            {prediction.species} · {prediction.breed || 'Unknown breed'} · {prediction.age ? `${prediction.age} years` : 'Age unknown'}
                          </p>
                          <p className="mt-2 text-xs text-ink-faint">
                            {formatDate(prediction.createdAt)} at {formatTime(prediction.createdAt)} · {prediction.aiResult?.confidenceScore || 0}% confidence
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleViewResult(prediction)}>
                          View Result
                        </Button>
                        <button
                          onClick={() => handleDelete(prediction)}
                          className="rounded-md p-1.5 text-signal-rose hover:bg-signal-rose-soft"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-ink-muted">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <PredictionFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isProcessing={isProcessing}
      />

      <PredictionResultModal
        isOpen={resultModal.isOpen}
        onClose={resultModal.close}
        prediction={selectedPrediction}
        onExport={handleExport}
        onCopy={handleCopy}
      />

      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Prediction"
        description="Are you sure you want to delete this prediction? This action cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} isLoading={isSubmitting}>
              Delete
            </Button>
          </>
        }
      />
    </div>
  );
}
