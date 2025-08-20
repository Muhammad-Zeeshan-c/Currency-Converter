const baseUrl="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";

const dropdowns = document.querySelectorAll(".dropdowns");

let toCurrency=document.querySelector("#to-dropdown");
let fromCurrency=document.querySelector("#from-dropdown");

let convertBtn=document.querySelector("#convert-btn");
let Amount=document.querySelector("#Amount-input");
let swapBtn=document.querySelector("#convert-pic")

//adding pics of currencies at bottom

function currenciesAtBottomPics(){
    let imgs=document.querySelectorAll(".currencies-imgs");

    for (image of imgs){
        let countCode=image.id;
        if (countCode !=="eu"){
        let otherSrc=`https://flagsapi.com/${countCode.toUpperCase()}/flat/64.png`;
        image.src=otherSrc;
        }
    }
}
currenciesAtBottomPics();

 
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode +" - "+countryList[currCode][0];
    newOption.value = currCode;
    if (select.name === "from" && currCode === "PKR") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "USD") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change",(evt)=>{
    updateFlag(evt.target);

  })

}

function updateFlag(element){
    let currCode=element.value;
    let countryCode=countryList[currCode][1];

    let newSrc=`https://flagsapi.com/${countryCode}/flat/64.png`
    let img=element.parentElement.querySelector("img");
    img.src=newSrc;
}


convertBtn.addEventListener("click",async (evt)=>{
    evt.preventDefault();
    let value =Amount.value;
    if (Amount.value==="" ||Amount.value<=0){
        Amount.value="1";
    }
    
    const url=`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.value.toLowerCase()}.json`;

    let Response=await fetch(url);
    Response=await Response.json();
    
    let price=Response[fromCurrency.value.toLowerCase()][toCurrency.value.toLowerCase()];

    let numericResult=price *Amount.value;



    let Rate;
    if (numericResult>1e10){
      Rate=numericResult.toExponential(2);

    }
    else if(numericResult>1){
      Rate=numericResult.toFixed(2); //reducing extra decimals
    }
    else{
      Rate=numericResult.toFixed(6);  // if result is too small 0.000005
    }

    let Result = `= ${Rate} ${toCurrency.value}`;




    let conversionResult=document.querySelector("#conversion-result")
    conversionResult.innerText=Result;
    conversionResult.style.display="flex";
})


swapBtn.addEventListener("click", () => {
  let temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  fromCurrency.dispatchEvent(new Event("change"));
  toCurrency.dispatchEvent(new Event("change"));
});