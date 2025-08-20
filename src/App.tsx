
import './App.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
} from "@tanstack/react-router";
import {router}from  '../src/router'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App
