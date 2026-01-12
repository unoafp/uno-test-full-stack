import AppProviders from "./common/providers";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppProviders>
        <Toaster position={"bottom-right"} />
        {/* <RouterProvider router={appRouter} /> */}
      </AppProviders>
    </>
  );
}

export default App;
