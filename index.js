"use strict";

const URI = "https://okrcentral.github.io/sample-okrs/db.json";

/**
 * helper function to populated parent and child objectives into html file
 * @param {map} tempObj - Js map with key as "id (of parent_objective)" and values as "Object{category: string, parentTitle: string, childTitles:[]}" 
 */
function populateHTMLElemnts(tempObj) {

    tempObj.forEach((value, key) => {
      // creating a parent title
      let parentTitleNode = document.createElement("LI");
      parentTitleNode.innerHTML = value.parentTitle;
      parentTitleNode.id = key;
      parentTitleNode.classList.add("parent-title-class");

      let arrowNode = document.createElement("DIV");
      arrowNode.classList.add("triangle-down");
      arrowNode.addEventListener("click", show_and_hide);
      parentTitleNode.prepend(arrowNode);
      
      
      document.getElementById("okrs").appendChild(parentTitleNode);

      // creating child titles 
      let orderedListNode = document.createElement("OL");
      orderedListNode.style.display = "block";
      orderedListNode.id = key + "child";
      orderedListNode.setAttribute("type", "a");
      
      for(let i = 0; i < value.childTitles.length; i++) {
          let childTitleNode = document.createElement("LI");
          childTitleNode.innerHTML = value.childTitles[i];
          childTitleNode.classList.add("child-title-class");
          orderedListNode.appendChild(childTitleNode);
      }
      document.getElementById("okrs").appendChild(orderedListNode);
  });
}

/**
 * function to fetch OKRs and apply filtering on them
 * @param {array} filterList - Js array containing filters
 */
function fetchOKRs(filterList) {
    console.log("Fetching OKR");
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          const okrs = JSON.parse(this.responseText),
                okrsArray = okrs.data;
          
          
          const tempObj = new Map();
          if(filterList.length != 0) {
            okrsArray.forEach((item) => {
                if(item.parent_objective_id.length === 0 && filterList.includes(item.category)) {
                    tempObj.set(item.id, {category: item.category, parentTitle: item.title, childTitles: []});
                }
            });
          } else {
            okrsArray.forEach((item) => {
                if(item.parent_objective_id.length === 0) {
                    tempObj.set(item.id, {category: item.category, parentTitle: item.title, childTitles: []});
                }
            });  
          }
          


          okrsArray.forEach((item) => {
              let parent_id = item.parent_objective_id;
              if(parent_id.length && tempObj.has(parent_id)) {
                  (tempObj.get(parent_id)).childTitles.push(item.title);
              }
           });


           populateHTMLElemnts(tempObj);

        }
      };

    xhttp.open("GET", URI, false);
    xhttp.send();

}



/**
 * collecting all checked filters and omit warning if no filter is selected
 */
function filterAllMatchingOKRs() {
  
  document.getElementById("okrs").innerHTML = "";
  const inputElementList = document.getElementsByName("filter");
  let isAllSet = 0, filterList = [];

  if(inputElementList.length != 0) {
      for(let i = 0; i < inputElementList.length; i++) {
        console.log(inputElementList[i]);
        if(inputElementList[i].checked) {
          filterList.push(inputElementList[i].id);
          if(inputElementList[i].id == "All") {
            isAllSet = 1; break;
          }
        }
      }

      console.log(filterList);
      if(isAllSet) {
        fetchOKRs([]);
      } else if(filterList.length){
        fetchOKRs(filterList);
      } else {
		document.getElementById("no-selected-filter").style.display = "block";
		setTimeout(() => {
			document.getElementById("no-selected-filter").style.display = "none";
		}, 1500);
		  
	  }
  }
}

/**
 * 
 * showing and hiding child objectives 
 */
function show_and_hide() {

  const par_id = this.parentNode.id;
  if(this.classList.contains("triangle-down")) {
      this.classList.remove("triangle-down");
      this.classList.add("triangle-right");

      document.getElementById(par_id+"child").style.display = "none";
  } else {
      this.classList.remove("triangle-right");
      this.classList.add("triangle-down");

      document.getElementById(par_id+"child").style.display = "block";
  }
  
}