var button = document.getElementById('download_button');

// Made by Md Joynul Abedin
// NOTE : Open attendance tab on Google Meet by clicking Participant Icon
// cntrl + shift + i for inspector tab, go to console (second option from top) and paste the following code to download attendance as a txt file
// you can update attendance at any time after having text file

button.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: `
            var TYPE = 'txt';
            var copyToClipboard = (value) => {
              var tempInput = document.createElement('input');
              tempInput.value = value;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand('copy');
              document.body.removeChild(tempInput);
            };

            var makeDownloadableFileAndSave = (data, filename, type) => {
              data = data.toString().replace(",","\\r\\r\\n")
              var file = new Blob([data], { type: type });
              if (window.navigator.msSaveOrOpenBlob)
                window.navigator.msSaveOrOpenBlob(file, filename);
              else {
                // Others
                var a = document.createElement('a'),
                  url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                }, 0);
              }
            };

            var init = () => {
              var showParticipantButton = document.querySelectorAll('[aria-label="Show everyone"]');
              if(showParticipantButton) {
                showParticipantButton[0].click()
                setTimeout(()=>{
                  // because animation takes time
                  var studentDivList = document.querySelectorAll('.XWGOtd');
                  console.log(document.title);
                  var studentNameList = [];
                  for (var i = 0; i < studentDivList.length; i++) {
                    var name = studentDivList[i].innerText.split(/[^a-zA-Z0-9_ ]/g);
                    //  name of the from in case of student ['Sunny', 'Sunny']
                    //  name of the from in case of teacher ['You', 'NameOfTeacher']
                    if (name[0].includes('You')) continue; // for meeting host i.e. teacher in this case
                    studentNameList.push(name[1]);
                  }
                  copyToClipboard(studentNameList);
                  var date = new Date();
                  var fileName = 'Attendance - '+ date.toDateString() + ' ' +
                    date.toTimeString().split(' ')[0];
                  // format Attendance - 20 oct 2020 14:21:49
                  makeDownloadableFileAndSave(studentNameList, fileName, TYPE);
                }, 2000)
              }
              
            };

            init()
    `,
    });
  });
};
