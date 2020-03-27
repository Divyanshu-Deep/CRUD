import productdb, { bulkcreate, getData, createEle} from './Module.js';

let db = productdb("productdb",{products : '++id,name,seller,price'});

//input 

const userid = document.getElementById("userid")
const proname = document.getElementById("proname")
const seller = document.getElementById("seller")
const price = document.getElementById("price")


 //buttons

 const btncreate = document.getElementById("btn-create");
 const btnread = document.getElementById("btn-read");
 const btnupdate = document.getElementById("btn-update");
 const btndelete = document.getElementById("btn-delete");

// notfound
const notfound = document.getElementById("notfound");

 //insert values using create buttons
btncreate.onclick = (event) => {
    let flag = bulkcreate(db.products, {
        name: proname.value,
        seller: seller.value,
        price: price.value
    })
   // console.log(flag);

/* productname="",
seller ="",
price=""
 */

    proname.value = seller.value = price.value ="";
getData(db.products, (data) => {
    userid.value = data.id + 1||1;
});

table();

let insertmsg = document.querySelector(".insert msg");

getMsg(flag, insertmsg);

}
  
// create event on btn read button
btnread.onclick = table;


// update list

btnupdate.onclick = () => {
    const id = parseInt(userid.value || 0);

    if(id){
        db.products.update(id,{
            name: proname.value,
            seller: seller.value,
            proce: price.value
        }).then((updated) => {
            let get = updated ? `data Updated` : `Couldn't Update data`;
            console.log(get);
            userid.value =  1;
            proname.value = "";
            seller.value = ""; 
            price.value =  ""
        })
    }
}

//delete record
 btndelete.onclick = () => {
     db.delete();
     db = productdb("Productdb", {
         products:`++id, name, seller, price`
     });
     db.open();
     table();
     textId(userid);
     let deletemsg = document.querySelector(".deletemsg");
     getMsg(true, deletemsg);
 }

window.onload = () => {
    textId(userid)
}

    function textId(textboxid) {
        getData(db.products, data => {
            textboxid.value = data.id + 1 || 1;
        })
    }
   








    function table(){
        const tbody = document.getElementById("tbody");
// to remove repetetion of child nodes
        while(tbody.hasChildNodes()){
            tbody.removeChild(tbody.firstChild);
        }
        
            getData(db.products,(data) => {
                if(data){
                    createEle("tr", tbody, tr => {
                        for(const value in data) {
                            createEle("td", tr, td => {
                                td.textContent = data.price === data[value] ? `₹ ${data[value]}` : data[value];
                            })
                        }

                        createEle("td", tr, td => {
                            createEle("i", td, i => {
                                i.className +="fas fa-edit btnedit";
                                i.setAttribute(`data-id`, data.id);
                                i.onclick = editbtn; //creating a edit function
                            })
                        })
                                createEle("td", tr, td => {
                                    createEle("i", td, i => {
                                        i.className += "fas fa-trash-alt btndelete" ;
                                        i.setAttribute(`data-id`, data.id);
                                        i.onclick = deletebtn;
                                    })
                                })

                    })
                }else{
                    notfound.textContent = "No record found in the database.!";
                }
            })
    }

    function editbtn(event){
    
        let id = parseInt(event.target.dataset.id);

        db.products.get(id, data => {
            userid.value = data.id || 0;
            proname.value = data.name || 0;
            seller.value = data.seller || ""; 
            price.value = data.price || ""
        })

    }

    function deletebtn(event){
        let id = parseInt(event.target.dataset.id);
        db.products.delete(id);
        table();
    }

    function getMsg(flag, element) {
        if(flag){
            element.className +="movedown";

            setTimeout(() => {
                element.classList.forEach(classname => {
                    classname == "movedown" ? undefined : element.classList.remove("movedown");
                });
            }, 4000);
        }
    }