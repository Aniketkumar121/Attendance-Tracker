window.onload = async() => {
    let allCourses = await getCourses();
   allCourses.forEach(course => {
       document.getElementsByClassName('subjects')[0].innerHTML +=` <div class="subs" id="${course._id}">${course.name}</div>`
   });

}

function getCourses() {
    return new Promise((Resolve, Reject) => {
        xhr = new XMLHttpRequest();
        xhr.open('GET', `/ProfCourses`, true);
        // xhr.setRequestHeader('X-CSRF-TOKEN', document.getElementById('myform').children[0].value);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.response);
                return Resolve(response);
            } else {
                return Reject("error");
            }
        };
        xhr.send();
    })
}

