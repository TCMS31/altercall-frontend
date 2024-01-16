import AppProviders from "./providers/AppProviders";
import AppRoutes from "./routes";

export const App = ({ client }) => (
  <AppProviders client={client}>
    <AppRoutes />
  </AppProviders>
);

export default App;
