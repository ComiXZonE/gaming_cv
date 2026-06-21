function print() {
  const printWindow = window.open("/print", "_blank");
  printWindow.onload = function () {
    printWindow.print();
    // Close the print window after a delay
    setTimeout(() => printWindow.close(), 500);
  };
}

function generatePDF() {
  window.scrollTo(0, 0);

  const btn = document.getElementById("pdfButton");
  const printBtn = document.querySelector(".print-button");
  btn.disabled = true;
  btn.style.visibility = "hidden";
  if (printBtn) printBtn.style.visibility = "hidden";

  const restore = () => {
    btn.disabled = false;
    btn.style.visibility = "visible";
    if (printBtn) printBtn.style.visibility = "visible";
  };

  const name = document.querySelector(".name").textContent;
  const filename = `${name.replace(/\s+/g, "")}.pdf`;
  const wrapper = document.querySelector(".wrapper");

  const pxToMm = 25.4 / 96;
  const widthMm = wrapper.offsetWidth * pxToMm + 20;
  const heightMm = wrapper.offsetHeight * pxToMm + 20;

  const opt = {
    margin: 10,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      onclone: function (clonedDoc) {
        clonedDoc.body.style.padding = "0";
        clonedDoc.body.style.margin = "0";
        const w = clonedDoc.querySelector(".wrapper");
        if (w) w.style.margin = "0";
      },
    },
    jsPDF: {
      unit: "mm",
      format: [widthMm, heightMm],
      orientation: "portrait",
    },
  };

  html2pdf()
    .set(opt)
    .from(wrapper)
    .toPdf()
    .get("pdf")
    .then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = totalPages; i > 1; i--) {
        pdf.deletePage(i);
      }
      pdf.save(filename);
      restore();
    })
    .catch((err) => {
      console.error("Error generating PDF:", err);
      restore();
    });
}
