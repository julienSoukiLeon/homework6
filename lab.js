window.onload = function() {loadList()};

var config = {
    apiKey: "AIzaSyBgg8xT0pUUEFSnm-7wptlsdIHrg1QvKn8",
    authDomain: "is445-homework6.firebaseapp.com",
    databaseURL: "https://is445-homework6.firebaseio.com",
    projectId: "is445-homework6",
    storageBucket: "is445-homework6.appspot.com",
    messagingSenderId: "191965740399"
};
firebase.initializeApp(config);

var addButton = document.getElementById("addElementButton");

addButton.addEventListener("click", function() {addButtonPressed()})

function addButtonPressed()
{
    var input = document.getElementById("addInput");
    
    if (!input.value || input.value == "")
        location.reload();
    var content = input.value;

    firebase.database().ref('todo/' + content).set({
        thingToDo : content
    }, function(error) {
        if (error) {
            console.log(error);
        } else {
            location.reload();
        }
    });

}

function loadList()
{
    var ulContainer = document.getElementById("todoUl");
    var ref = firebase.database().ref('todo');

    ref.once("value", function(snapshot) {
        snapshot.forEach(function(data) {
            var li = document.createElement("LI");
            var editButton = document.createElement("BUTTON");
            var deleteButton = document.createElement("BUTTON");

            editButton.appendChild(document.createTextNode("edit"));
            deleteButton.appendChild(document.createTextNode("delete"));
            li.appendChild(document.createTextNode(data.val().thingToDo));
            li.appendChild(deleteButton);
            li.appendChild(editButton);
            ulContainer.appendChild(li);

            editButton.addEventListener("click", function() {editButtonClicked(data.val().thingToDo)})
            deleteButton.addEventListener("click", function() {deleteButtonClicked(data.val().thingToDo)})
        });
    });
}

function deleteButtonClicked(thingToDo)
{
    var retVal = confirm("Are you sure you want to remove " + thingToDo +  " ?");
    if( retVal == true ) {
        firebase.database().ref('todo/' + thingToDo).remove(
            function(error) {
            if (error) {
                console.log(error);
            } else {
                location.reload();
            }
        });
    }
}

function editButtonClicked(thingToDo)
{
    var ul = document.getElementById("todoUl");
    let lis = ul.childNodes;
    
    for (var i = 0; i < lis.length; i++)
    {
        if (lis[i].textContent.split("deleteedit")[0] === thingToDo)
        {
            lis[i].innerHTML = "";

            var cancelButton = document.createElement("BUTTON");
            var saveButton = document.createElement("BUTTON");
            var input = document.createElement("INPUT");


            input.setAttribute("id", thingToDo);
            cancelButton.appendChild(document.createTextNode("cancel"));
            saveButton.appendChild(document.createTextNode("save"));

            lis[i].appendChild(input);
            lis[i].appendChild(cancelButton);
            lis[i].appendChild(saveButton);

            cancelButton.addEventListener("click", function() {cancelButtonClicked(thingToDo)});
            saveButton.addEventListener("click", function() {editTodoList(thingToDo)});
        }
    }
}

function cancelButtonClicked(thingToDo)
{
    var lis = document.getElementById("todoUl").childNodes;
    var editButton = document.createElement("BUTTON");
    var deleteButton = document.createElement("BUTTON");
    

    for (var i = 0; i < lis.length; i++)
    {
        if (lis[i].textContent === "cancelsave")
        {
            lis[i].textContent = "";
            editButton.appendChild(document.createTextNode("edit"));
            deleteButton.appendChild(document.createTextNode("delete"));
            var li = lis[i];
            li.appendChild(document.createTextNode(thingToDo));
            li.appendChild(deleteButton);
            li.appendChild(editButton);
                    
            editButton.addEventListener("click", function() {editButtonClicked(thingToDo)});
            deleteButton.addEventListener("click", function() {deleteButtonClicked(thingToDo)});
        }
    }
}

function editTodoList(oldThingToDo)
{
    var newThingToDo = document.getElementById(oldThingToDo).value;

    firebase.database().ref('todo/' + oldThingToDo).remove(
        function(error) {
        if (error) {
            console.log(error);
        } else {
            firebase.database().ref('todo/' + newThingToDo).set({
                thingToDo : newThingToDo
            }, function(error) {
                if (error) {
                    console.log(error);
                } else {
                    location.reload();
                }
            });
                }
    });
}
