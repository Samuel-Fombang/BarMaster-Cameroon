import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type ExportReportToPdfOptions = {
  title: string;
  fileName: string;
  columns: string[];
  rows: Array<Array<string | number>>;
  summary?: Array<{
    label: string;
    value: string;
  }>;
};

export function exportReportToPdf({
  title,
  fileName,
  columns,
  rows,
  summary = [],
}: ExportReportToPdfOptions): void {
  const document = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  document.setFontSize(18);
  document.setFont("helvetica", "bold");
  document.text("IVY EASY LOUNGE", 14, 15);

  document.setFontSize(13);
  document.text(title, 14, 24);

  document.setFontSize(9);
  document.setFont("helvetica", "normal");

  document.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    31
  );

  let tableStartY = 38;

  if (summary.length > 0) {
    const summaryText = summary
      .map(
        (item) =>
          `${item.label}: ${item.value}`
      )
      .join("    |    ");

    const wrappedSummary =
      document.splitTextToSize(
        summaryText,
        265
      );

    document.setFontSize(10);
    document.text(
      wrappedSummary,
      14,
      38
    );

    tableStartY =
      38 +
      wrappedSummary.length * 5 +
      4;
  }

  autoTable(document, {
    startY: tableStartY,
    head: [columns],
    body: rows,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [20, 20, 20],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: {
      left: 14,
      right: 14,
    },
    didDrawPage: () => {
      const pageNumber =
        document.getCurrentPageInfo()
          .pageNumber;

      document.setFontSize(8);
      document.setTextColor(100);

      document.text(
        `Page ${pageNumber}`,
        document.internal.pageSize.getWidth() -
          25,
        document.internal.pageSize.getHeight() -
          8
      );
    },
  });

  document.save(
    fileName.endsWith(".pdf")
      ? fileName
      : `${fileName}.pdf`
  );
}