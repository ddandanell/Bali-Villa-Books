import React from "react";
import { renderToString } from "react-dom/server";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { TooltipProvider } from "./components/ui/tooltip";

export function render(): string {
  return renderToString(<QueryClientProvider client={new QueryClient()}><TooltipProvider><Router ssrPath="/"><Home /></Router></TooltipProvider></QueryClientProvider>);
}
