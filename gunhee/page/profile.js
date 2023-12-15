 function toggleBtn1() {
        const textbox=document.getElementById('textbox');
        const plus=document.getElementById('plus');
        const saveButton=document.getElementById('saveButton');
           textbox.style.display = textbox.style.display === 'block' ? 'none' : 'block';
           plus.style.display=plus.style.display==='none' ? 'block' : 'none';
           saveButton.style.display=plus.style.display==='none' ? 'block' : 'none';
           document.getElementById("output").textContent="";
        }
        
        document.getElementById("saveButton").addEventListener("click", function(e) {
            var textToSave = document.getElementById("myTextarea").value;
            var formattedText=textToSave.replace(/\n/g, "<br>");
            localStorage.setItem("savedText", textToSave);
            textbox.style.display = '';
            saveButton.style.display = 'none';
            e.preventDefault();
            document.getElementById("output").innerHTML=formattedText;
            plus.style.display=plus.style.display==='none' ? 'block' : 'none';
        });
        window.addEventListener("load", function () {
            var savedText = localStorage.getItem("savedText");
            if (savedText) {
                document.getElementById("myTextarea").value = savedText;
                document.getElementById("output").innerHTML = savedText;
            }
        });
