var alamCount = 0;
var alarmflg = 0;
var timerMasterJson = {};
var resultJson = {};
var currentPage = 0;
var attempts=3;
let pdfPageNo=129;
let pdfUrl="images/Referance.pdf";

let totalQuestions=12;
let pageScores = {}; // Object to store scores for each page
function questionAns() {
//    timerMasterJson.fault = $("#counter").text();
//    console.log(timerMasterJson);
//    seconds = 0;
//    updateCounter();
	$("#panelDiv").html("");
    $("#Header,#counter").prop("hidden",false);
    $("#Header").html("<center>PRE-COMMISSIONING</center>");

    // Shuffle function (keeps array length intact)
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // Split questions into pages without shuffling their groups
    let page1 = shuffleArray([...quizData.questions.slice(0, 3)]); // Shuffle only Q1-Q3
    let page2 = shuffleArray([...quizData.questions.slice(3, 6)]); // Shuffle only Q4-Q6
    let page3 = shuffleArray([...quizData.questions.slice(6)]);    // Shuffle remaining questions

    let pages = [page1, page2, page3];
    
    let htm = `
        <div class="row">
          <div class="col-sm-2" id="btnDiv">
          <button class="btn btn-primary" id="pdf1" >View PDF Page 129</button>
       
          </div>
          <div class="col-sm-9">
            <div class="quiz-container" style="margin-bottom:px;">
                <h2 class="text-center mb-4" id="QuizTitle">Quiz</h2>
                <p id="page-indicator" class="text-center font-weight-bold" style="float: right; color: cornflowerblue;"></p>
                <form id="quiz-form">
                    <table class="table question-table">
                        <thead>
                            <tr class="table-primary">
                                <th>Question No.</th>
                                <th>Question</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody id="questions-container"></tbody>
                    </table>
                    <div class="pagination-buttons">
                        <button type="button" id="prev-page" class="btn btn-secondary" hidden>Previous</button>
                        <button type="button" id="next-page" class="btn btn-secondary" style="float:right;margin-bottom:50px;margin-right:5px" disabled>Next</button>
                         <button type="submit" class="btn btn-primary " id="submitBtn"  style="float:right;margin-bottom:50px;margin-right:5px" data-toggle="modal" data-target="#messageModal">Submit</button>
              			 <button type="button" class="btn btn-primary " id="result" style="float:right;margin-bottom:50px;margin-right:5px" hidden >Result</button>
                    </div>
                    
                    
                   
                </form>
                
          </div>
        </div>

       <!-- Modal -->
<div class="modal fade" id="pdfModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">PDF Viewer</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <iframe id="pdfViewer" width="100%" height="800px"></iframe>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="pdfModal1" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">PDF Viewer</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <iframe id="pdfViewer1" width="100%" height="800px"></iframe>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="pdfModal2" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">PDF Viewer</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <iframe id="pdfViewer2" width="100%" height="800px"></iframe>
            </div>
        </div>
    </div>
</div>        
    `;
    
    	 htm+='	<!-- 			    The Modal  ProStr -->'
    +'	  <div class="modal fade " id="messageModal">'
    +'	    <div class="modal-dialog modal-md" >'
    +'		      <div class="modal-content">'
    +'<!-- 		        Modal Header -->'
    +'		        <div class="modal-header">'
    +'	          <h4 class="modal-title"><center>Message Box</center></h4>'
    +'		          <button type="button" class="close" data-dismiss="modal">&times;</button>'
    +'		        </div>'
    +'<!-- 		        Modal body -->'
    +'		        <div class="modal-body" id="modal-message" style="color:brown">'

    +'		        </div>'
    +'<!-- 			        Modal footer -->'
    +'		        <div class="modal-footer">'
    +'	             <button type="button" class="btn btn-danger" data-dismiss="modal" >Close</button>'
    +'		        </div>'
    +'		      </div>'
    +'		    </div>'
    +'		  </div>'
    +'<!-- 			  End Modal ProStr -->'
    
    $("#mainDiv").html(htm);
    	 $("#result").click(function () {
    		 var quesNo="que"+currentPage;
             timerMasterJson[quesNo] = $("#counter").text();
             console.log(timerMasterJson);
             seconds = 0;
             updateCounter();
     		result();
     	});

    	
    	 $("#pdf1").click(function () {
    	      let pdfWithPage = `${pdfUrl}#page=${pdfPageNo}`;
    	      console.log("Opening PDF Page:", pdfWithPage);
    	      
    	      document.getElementById("pdfViewer").src = pdfWithPage;

    	      var pdfModal = new bootstrap.Modal(document.getElementById("pdfModal"));
    	      pdfModal.show();
    	  });
    function renderQuestions() {
        let questionsContainer = $('#questions-container');
        questionsContainer.empty();

        pages[currentPage].forEach((item, index) => {
            let questionBlock = `
                <tr>
                    <td><center>${(currentPage * 3) + index + 1}</center></td>
                    <td> ${item.question}</td>
                    <td>
                        ${item.options.map(option => `
                            <div class="form-check" style="margin:5px;">
                                <input class="form-check-input" type="radio" name="question${index}" value="${option}">
                                <label class="form-check-label">${option}</label>
                            </div>
                        `).join('')}
                    </td>
                </tr>`;
            $("#QuizTitle").html(item.QuizTitle);
            questionsContainer.append(questionBlock);
        });

        $("#page-indicator").text(`Page ${currentPage + 1} of ${pages.length}`);
    }

    $(document).ready(function () {
        renderQuestions();

        $('#prev-page').click(function () {
            if (currentPage >0) {
                console.log("currentPage: " + currentPage);
                
                // Assign different PDF page numbers based on the current quiz page
                currentPage--;
                if (currentPage === 0) {
                    pdfPageNo = 129;
                } 
                else if (currentPage === 1) {
                    pdfPageNo = 131;
                }
                else if (currentPage === 2) {
                    pdfPageNo = 179;
                } 

                // Generate the "View PDF" button dynamically
                let htm = `
                    <button class="btn btn-primary" id="pdf1" >
                        View PDF Page ${pdfPageNo}
                    </button>
                `;
                $("#btnDiv").html(htm);
                $('#pdf1').click(function () {
             	   PDFDemo();
                });
//                selectedValue();
                renderQuestions();
//                $('#result').html('');
            }
        });

        $('#next-page').click(function () {
        	var quesNo="que"+currentPage;
            timerMasterJson[quesNo] = $("#counter").text();
            console.log(timerMasterJson);
            seconds = 0;
            updateCounter();
        	attempts=3;
        	  $('#next-page').prop("disabled", true);
        	  $('#submitBtn').prop("disabled", false);
            if (currentPage < pages.length - 1) {
                console.log("currentPage: " + currentPage);
                currentPage++;
                // Assign different PDF page numbers based on the current quiz page
                if (currentPage === 0) {
                    pdfPageNo = 129;
                    
                } else if (currentPage === 1) {
                    pdfPageNo = 131;
                } else if (currentPage === 2) {
                    pdfPageNo = 179;
                }

                // Generate the "View PDF" button dynamically
                let htm = `
                    <button class="btn btn-primary" id="pdf1" >
                        View PDF Page ${pdfPageNo}
                    </button>
                `;
                $("#btnDiv").html(htm);

              
               $('#pdf1').click(function () {
            	   PDFDemo();
               });
//               selectedValue();
                renderQuestions();
//                $('#result').html('');
            }
        });
        
        
        
      function PDFDemo() {
      let pdfWithPage = `${pdfUrl}#page=${pdfPageNo}`;
      console.log("Opening PDF Page:", pdfWithPage);
      
      if(pdfPageNo == 131){
	      document.getElementById("pdfViewer1").src = pdfWithPage;
	      var pdfModal = new bootstrap.Modal(document.getElementById("pdfModal1"));
	      pdfModal.show();
      }else if(pdfPageNo == 179){
	      document.getElementById("pdfViewer2").src = pdfWithPage;
	      var pdfModal = new bootstrap.Modal(document.getElementById("pdfModal2"));
	      pdfModal.show();
		  
	  }
  }


      $('#quiz-form').on('submit', function (e) {
    	  $("#modal-message").css({
    		    "font-weight": "bold",
    		    "color": "brown"
    		});
          e.preventDefault();
          let score = 0;
         let tmpQues = 0;
		 let unanswered = 0;
        	  
	    	  pages[currentPage].forEach((item, index) => {
	              let selected = $(`input[name='question${index}']:checked`).val(); // Keep selection intact
	              if (!selected) {
	                  unanswered++;
	              } else if (selected === item.correct_option) {
	                  score++;
	              }
	          });
	    	  if (unanswered > 0) {
	              $("#modal-message").html(`Please answer all questions before submitting.`);
	              return;	              
	          }
    	  console.log("score "+score);
		  
		  if(currentPage == 0){tmpQues = 3;}else if(currentPage == 1){tmpQues = 3;}else if(currentPage == 2){tmpQues = 6;}
		  
          // Store the score for the current page
          pageScores[currentPage] = score;

          // Generate a summary of results for all pages
          let resultSummary = `<strong>Page-wise Results:</strong><br>`;
          Object.keys(pageScores).forEach(page => {
              resultSummary += `Page ${parseInt(page) + 1}: ${pageScores[page]} / ${pages[page].length} correct <br>`;
          });

          if (score === tmpQues) {
        	  $("#modal-message").css({
      		    "font-weight": "bold",
      		    "color": "green"
      		});
              resultSummary += `<br>All answers are correct for this page!`;
			  if(currentPage == 2){
				$('#submitBtn,#next-page').prop("hidden", true);
				$('#result').prop("hidden", false); 
			  }else{			  
				$('#next-page').prop("disabled", false);
			  }
          } else {
              attempts--;
              if (attempts > 0) {
                  resultSummary += `<br>You got ${score} out of ${tmpQues} correct on this page.<br> ${attempts} attempts left.`;
              } else {
				  if(currentPage == 2){
					resultSummary += `<br>You got ${score} out of ${tmpQues} correct. <br>No more attempts left.`;
				  }else{
					resultSummary += `<br>You got ${score} out of ${tmpQues} correct. <br>No more attempts left. Moving to the next page by clicking on Next button.`;
				  }
                  $('#next-page').prop("disabled", false);
                  $('#submitBtn').prop("disabled", true);
                  
                  if(currentPage==2){
                	  $('#submitBtn,#next-page').prop("hidden", true);
                	  $('#result').prop("hidden", false);  
                  }
              }
          }

          $("#modal-message").html(resultSummary);
          
          var name="page"+currentPage;
          resultJson[name]=score;
          console.log(resultJson);
      });



    });

}
