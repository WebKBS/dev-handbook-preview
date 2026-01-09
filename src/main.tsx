import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// 생성된 경로 트리 가져오기
import { routeTree } from "./routeTree.gen";

// 새 라우터 인스턴스 만들기
const router = createRouter({ routeTree });

// 유형 안전성을 위해 라우터 인스턴스 등록
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
