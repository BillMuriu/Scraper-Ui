"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function BreadcrumbHeader() {
  const pathName = usePathname();
  const path = pathName === "/" ? [""] : pathName?.split("/");
  return (
    <div className="flex items-center flex-start">
      <Breadcrumb></Breadcrumb>
    </div>
  );
}

export default BreadcrumbHeader;
