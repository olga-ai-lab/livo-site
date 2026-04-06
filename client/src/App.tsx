import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomeLivonius from "./pages/HomeLivonius";
import HomeLivo from "./pages/HomeLivo";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ProdutoRCO from "./pages/ProdutoRCO";
import ProdutoSolar from "./pages/ProdutoSolar";
import ProdutoGarantia from "./pages/ProdutoGarantia";
import ProdutoAgro from "./pages/ProdutoAgro";
import ProdutoEngenharia from "./pages/ProdutoEngenharia";
import ProdutoSaude from "./pages/ProdutoSaude";
import Sinistro from "./pages/Sinistro";
import CotacaoConversacional from "./pages/CotacaoConversacional";
import CadastroCorretor from "./pages/CadastroCorretor";
import SinistroConversacional from "./pages/SinistroConversacional";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={HomeLivonius} />
      <Route path={"/sinistro"} component={Sinistro} />
      <Route path="/cotacao" component={CotacaoConversacional} />
      <Route path="/cotar" component={CotacaoConversacional} />
      <Route path={"/livonius"} component={HomeLivonius} />
      <Route path="/livo" component={HomeLivo} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      
      {/* Product Routes */}
      <Route path="/livonius/rco" component={ProdutoRCO} />
      <Route path="/livo/solar" component={ProdutoSolar} />
      <Route path="/livo/garantia" component={ProdutoGarantia} />
      <Route path="/livo/agro" component={ProdutoAgro} />
      <Route path="/livo/engenharia" component={ProdutoEngenharia} />
      <Route path="/livo/saude" component={ProdutoSaude} />
      
      {/* Cadastro e Sinistro */}
      <Route path="/corretor" component={CadastroCorretor} />
      <Route path="/parceiro" component={CadastroCorretor} />
      <Route path="/seja-parceiro" component={CadastroCorretor} />
      <Route path="/sinistro-novo" component={SinistroConversacional} />
      <Route path="/abrir-sinistro" component={SinistroConversacional} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
