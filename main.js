// author: Atieh Barati Nia
// student No.: 9631010

// to accesse to html objects 
let name_user = document.getElementById("name-user")
let blog_user = document.getElementById("blog-user")
let recent_repo = document.getElementById("recent-repo")
let city_user = document.getElementById("city-user")
let bio = document.getElementById("bio")
let img_user = document.getElementById("img-user")
let btn_submit = document.getElementById("btn-submit")
let input_username = document.getElementById("input-username")

// using local storage
let myStorage = window.localStorage

// a function for replacing all ocurrence of str1 with str2
String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 
// for sorting Array by the value of a property
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
// on click handler for submit button
function btnclick(e){
    e.preventDefault()
    username = input_username.value 
    const user = myStorage.getItem(username)
    let seperation = "$!?"
    if(user != null){
        /** fetching from local storage */
        console.log(user)
        result = user.split("$!?")
        name_user.innerHTML = result[0]
        blog_user.innerHTML = result[1]
        bio.style.color = "#000000"
        city_user.innerHTML = result[2]
        bio.innerHTML = result[3]
        img_user.src = result[4]
        recent_repo.innerHTML = result[5]
    }else{
        url = 'http://api.github.com/users/'+ username
        // fetch the data from github
        fetch(url).then(response => {
            console.log(response.status, response.statusText)
            //console.log(response)
            if (!response.ok){
                if(response.status == 404){
                    bio.innerHTML = "The user is not found!";
                    bio.style.color = "#ed0000"
                    name_user.innerHTML = "";
                    blog_user.innerHTML = "";
                    city_user.innerHTML = "";
                    recent_repo.innerHTML = ""
                    img_user.src = 'images/profile.png'
                }
                return 0
            }
            return response.json()
        }).then(myJson => {
            if(myJson == 0){
                return
            }
            /** update contents of html */
            name_user.innerHTML = myJson['name'];
            if(myJson['bio']!= null){
                bio.innerHTML = myJson['bio'].replaceAll("\r\n", "<br>")
            }
            bio.style.color = "#000000"
            blog_user.innerHTML = myJson['blog']
            city_user.innerHTML = myJson['location']
            // fetch the avatar
            if ( myJson['avatar_url'] != null){
                img_user.src = 'images/loading.png'
                img_user.src = myJson['avatar_url'];
            } 
            if (bio.innerHTML ==""){
                bio.innerHTML = 'bio'
            }
            let url_repo = myJson['repos_url'].replace("https", "http")
            /** fetching data of repos */
            fetch(url_repo)
                .then(response => {
                    
                    return response.json()
                })
                .then(repoJson => {
                    console.log(repoJson)
                    if(repoJson.length==0){
                        recent_repo.innerHTML =""
                    }else{
                        repoJson = repoJson.sort(dynamicSort("pushed_at"))
                        var repo = ""
                        for(let i =0; i < 5;i++){
                            repo += (i+1) + ") " + repoJson[i]['name'] +",<br>     "+ "language: "+repoJson[i]['language']+ '<br>'
                        }
                        recent_repo.innerHTML ="5 recent repos:<br>"+ repo
                    }
                    //update cache 
                    let seperation = "$!?"
                    let cache = name_user.innerHTML + seperation + blog_user.innerHTML
                        + seperation + city_user.innerHTML + seperation + bio.innerHTML 
                        + seperation + img_user.src + seperation + recent_repo.innerHTML
                    myStorage.setItem(username, cache)
                });
            
            
        })
        /* for catching errors and empty contents*/ 
        .catch(error =>{
            bio.innerHTML = "Network Connection Error!"
            bio.style.color = "#ed0000"
            name_user.innerHTML = ""
            blog_user.innerHTML = ""
            city_user.innerHTML = ""
            recent_repo.innerHTML = ""
            img_user.src = 'images/profile.png'
        })
    }
    
}
btn_submit.onclick=btnclick


