document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("userInput");
    const btnQR = document.getElementById("btnQR");
    const btnBar = document.getElementById("btnBar");
    const printBtn = document.getElementById("printBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const qrContainer = document.getElementById("qrcode");
    const barImg = document.getElementById("barcode");
    const emptyState = document.getElementById("empty-state");

    function resetStage() {
        qrContainer.innerHTML = "";
        qrContainer.style.display = "none";
        barImg.src = "";
        barImg.style.display = "none";
        emptyState.style.display = "none";
        printBtn.style.display = "none";
        downloadBtn.style.display = "none";
    }

    btnQR.addEventListener("click", () => {
        const val = input.value.trim();
        if (!val) return alert("Please enter text or a URL!");

        resetStage();
        qrContainer.style.display = "block";

        try {
            new QRCode(qrContainer, {
                text: val,
                width: 220,
                height: 220,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            setTimeout(() => {
                printBtn.style.display = "block";
                downloadBtn.style.display = "block";
            }, 200);
        } catch (e) {
            console.error(e);
        }
    });

    btnBar.addEventListener("click", () => {
        const val = input.value.trim();
        if (!val) return alert("Please enter text or numbers!");

        resetStage();
        barImg.style.display = "block";

        try {
            JsBarcode(barImg, val, {
                format: "CODE128",
                lineColor: "#000000",
                width: 2,
                height: 90,
                displayValue: true,
                fontSize: 18,
                background: "#ffffff",
                margin: 15
            });
            printBtn.style.display = "block";
            downloadBtn.style.display = "block";
        } catch (err) {
            alert("Invalid characters for barcode.");
            resetStage();
            emptyState.style.display = "block";
        }
    });

    printBtn.addEventListener("click", () => {
        const isQR = qrContainer.style.display === "block";
        const imgSrc = isQR ? qrContainer.querySelector("img").src : barImg.src;

        if (!imgSrc) return;

        const printWin = window.open('', '_blank');
        printWin.document.write(`
            <html>
                <head><title>Print Code</title></head>
                <body style="display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
                    <img src="${imgSrc}" style="max-width:100%;">
                </body>
            </html>
        `);
        printWin.document.close();
        printWin.onload = function() {
            printWin.focus();
            printWin.print();
            printWin.close();
        };
    });

    downloadBtn.addEventListener("click", () => {
        const isQR = qrContainer.style.display === "block";
        let a = document.createElement("a");
        a.download = isQR ? "QR_Code.png" : "Barcode.png";

        if (isQR) {
            const img = qrContainer.querySelector("img");
            if (img) {
                a.href = img.src;
                a.click();
            }
        } else {
            a.href = barImg.src;
            a.click();
        }
    });
});