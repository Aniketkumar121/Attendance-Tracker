window.onload = async () => {
    let allCourses = await getCourses();
    allCourses.forEach((course, index) => {
        totalPresent = calculate_attandance(course.attandance);
        totalDay = course.attandance.length;

        // Create wrapper element for the chart
        const chartWrapper = document.createElement('div');
        chartWrapper.classList.add('chart');

        // Add canvas element to the chart wrapper
        const canvasElement = document.createElement('canvas');
        canvasElement.id = `myChart${index}`;
        chartWrapper.appendChild(canvasElement);

        // Add percent and course name to the chart wrapper
        const percentElement = document.createElement('h3');
        percentElement.classList.add('percent');
        percentElement.textContent = `${Math.ceil((totalPresent / totalDay) * 100)}%`;
        chartWrapper.appendChild(percentElement);

        const subElement = document.createElement('h4');
        subElement.classList.add('sub');
        subElement.textContent = course.course.name;
        chartWrapper.appendChild(subElement);

        // Add the chart wrapper to both the charts and subjects elements
        document.getElementsByClassName('charts')[0].appendChild(chartWrapper);

        const subsWrapper = document.createElement('div');
        subsWrapper.classList.add('subs');
        subsWrapper.id = course.course._id;
        subsWrapper.textContent = course.course.name;
        document.getElementsByClassName('subjects')[0].appendChild(subsWrapper);

        // Create the chart using the canvas element
        const ctx = canvasElement.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    label: 'My First Dataset',
                    data: [totalPresent, totalDay - totalPresent],
                    backgroundColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                    ],
                    hoverOffset: 4
                }]
            },
        });
    });
    console.log(allCourses);
}


function calculate_attandance(attandance) {
    let total_present = 0;
    attandance.forEach(day => {
        total_present += day.isPresent;
    })
    return total_present;
}

function getCourses() {
    return new Promise((Resolve, Reject) => {
        console.log("gooo");
        xhr = new XMLHttpRequest();
        xhr.open('GET', `/StudentCourses`, true);
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