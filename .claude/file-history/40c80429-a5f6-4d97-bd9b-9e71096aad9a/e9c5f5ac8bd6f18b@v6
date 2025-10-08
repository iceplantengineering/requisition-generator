import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import NDAGateway from "./components/NDAGateway";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import OrderStock from "./pages/OrderStock";
import ProductionPlan from "./pages/ProductionPlan";
import IndirectMaterials from "./pages/IndirectMaterials";
import UtilityManagement from "./pages/UtilityManagement";
import FinishedProducts from "./pages/FinishedProducts";
import Certification from "./pages/Certification";
import Carbon from "./pages/Carbon";
import EnvironmentalMonitoring from "./pages/EnvironmentalMonitoring";
import Analytics from "./pages/Analytics";
import SupplierPortal from "./pages/SupplierPortal";
import Quality from "./pages/Quality";
import CostAnalysis from "./pages/CostAnalysis";
import PredictiveAnalytics from "./pages/PredictiveAnalytics";
import AdvancedReporting from "./pages/AdvancedReporting";
import MassBalanceDashboard from "./components/imbl/MassBalanceDashboard";
import CertificateGenerator from "./components/imbl/CertificateGenerator";
import IntegrationDashboard from "./components/isa95/IntegrationDashboard";
import EdgeCollectorDashboard from "./components/iot/EdgeCollectorDashboard";
import DigitalProductPassport from "./pages/DigitalProductPassport";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import ProductionPlanForm from "./components/production/ProductionPlanForm";
import FinishedProductForm from "./components/products/FinishedProductForm";
import LLMApiSettings from "./components/settings/LLMApiSettings";
import AIReportGenerator from "./components/reports/AIReportGenerator";
import AICreditCalculator from "./components/credit/AICreditCalculator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [hasConsent, setHasConsent] = useState<boolean>(() => {
    // Initialize from sessionStorage on mount
    const consent = sessionStorage.getItem('nda-consent');
    console.log('App init - sessionStorage nda-consent:', consent);
    console.log('App init - hasConsent will be:', consent === 'accepted');
    return consent === 'accepted';
  });

  console.log('App render - hasConsent:', hasConsent);

  if (!hasConsent) {
    console.log('Showing NDAGateway');
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <NDAGateway onAccept={() => {
            console.log('Gateway accepted, setting hasConsent to true');
            setHasConsent(true);
          }} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  console.log('Showing main app');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/order-stock" element={<OrderStock />} />
              <Route path="/production-plan" element={<ProductionPlan />} />
              <Route path="/indirect-materials" element={<IndirectMaterials />} />
              <Route path="/utility-management" element={<UtilityManagement />} />
              <Route path="/finished-products" element={<FinishedProducts />} />
              <Route path="/supplier-portal" element={<SupplierPortal />} />
              <Route path="/quality" element={<Quality />} />
              <Route path="/cost-analysis" element={<CostAnalysis />} />
              <Route path="/edge-collectors" element={<EdgeCollectorDashboard />} />
              <Route path="/predictive-analytics" element={<PredictiveAnalytics />} />
              <Route path="/advanced-reporting" element={<AdvancedReporting />} />
              <Route path="/certification" element={<Certification />} />
              <Route path="/carbon" element={<Carbon />} />
              <Route path="/environmental-monitoring" element={<EnvironmentalMonitoring />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/mass-balance" element={<MassBalanceDashboard />} />
              <Route path="/certificate-generator" element={<CertificateGenerator />} />
              <Route path="/isa95-integration" element={<IntegrationDashboard />} />
              <Route path="/digital-product-passport" element={<DigitalProductPassport />} />
              <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
              <Route path="/production-plan/new" element={<ProductionPlanForm />} />
              <Route path="/production-plan/edit/:id" element={<ProductionPlanForm />} />
              <Route path="/finished-products/new" element={<FinishedProductForm />} />
              <Route path="/finished-products/edit/:id" element={<FinishedProductForm />} />
              <Route path="/llm-settings" element={<LLMApiSettings />} />
              <Route path="/ai-report-generator" element={<AIReportGenerator />} />
              <Route path="/ai-credit-calculator" element={<AICreditCalculator />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
