console.clear();
var countRect = 0;
var pressed = false;
var imgTable = 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTAgNTAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUwIDUwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNNDQuMTEzLDI0LjY5OWMwLDQuODg5LTguNTI5LDguODU0LTE5LjA0OSw4Ljg1NGMtMTAuNTIxLDAtMTkuMDUyLTMuOTY1LTE5LjA1Mi04Ljg1NCAgIGMwLTQuODg3LDguNTMtOC44NSwxOS4wNTItOC44NUMzNS41ODQsMTUuODUsNDQuMTEzLDE5LjgxMyw0NC4xMTMsMjQuNjk5eiI+PC9wYXRoPjxnPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0yMy44NTcsMTIuMjkxYzAsMS4yMDUtMC43MDEsMi4xODQtMS41NjUsMi4xODRoLTguODQ0Yy0wLjg2NSwwLTEuNTY2LTAuOTc5LTEuNTY2LTIuMTg0bDAsMCAgICBjMC0xLjIwMywwLjcwMS0yLjE4MiwxLjU2Ni0yLjE4Mmg4Ljg0NEMyMy4xNTYsMTAuMTA5LDIzLjg1NywxMS4wODgsMjMuODU3LDEyLjI5MUwyMy44NTcsMTIuMjkxeiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0zOC4yNDYsMTIuMjkxYzAsMS4yMDUtMC43MDEsMi4xODQtMS41NjgsMi4xODRoLTguODRjLTAuODY5LDAtMS41NjgtMC45NzktMS41NjgtMi4xODRsMCwwICAgIGMwLTEuMjAzLDAuNjk5LTIuMTgyLDEuNTY4LTIuMTgyaDguODRDMzcuNTQ1LDEwLjEwOSwzOC4yNDYsMTEuMDg4LDM4LjI0NiwxMi4yOTFMMzguMjQ2LDEyLjI5MXoiPjwvcGF0aD48L2c+PGc+PHBhdGggZmlsbD0iIzAwMDAwMCIgZD0iTTIzLjg1NywzNy43MTFjMCwxLjIwNS0wLjcwMSwyLjE4LTEuNTY1LDIuMThoLTguODQ0Yy0wLjg2NSwwLTEuNTY2LTAuOTc1LTEuNTY2LTIuMThsMCwwICAgIGMwLTEuMjA1LDAuNzAxLTIuMTgyLDEuNTY2LTIuMTgyaDguODQ0QzIzLjE1NiwzNS41MjksMjMuODU3LDM2LjUwNiwyMy44NTcsMzcuNzExTDIzLjg1NywzNy43MTF6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzAwMDAwMCIgZD0iTTM4LjI0NiwzNy43MTFjMCwxLjIwNS0wLjcwMSwyLjE4LTEuNTY4LDIuMThoLTguODRjLTAuODY5LDAtMS41NjgtMC45NzUtMS41NjgtMi4xOGwwLDAgICAgYzAtMS4yMDUsMC42OTktMi4xODIsMS41NjgtMi4xODJoOC44NEMzNy41NDUsMzUuNTI5LDM4LjI0NiwzNi41MDYsMzguMjQ2LDM3LjcxMUwzOC4yNDYsMzcuNzExeiI+PC9wYXRoPjwvZz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMy4wMDksMTguNzE1YzEuMTQ0LDAsMi4wNzIsMC42OTksMi4wNzIsMS41NjN2OC44NDRjMCwwLjg2NS0wLjkyOSwxLjU2OC0yLjA3MiwxLjU2OGwwLDAgICBjLTEuMTQxLDAtMi4wNjktMC43MDMtMi4wNjktMS41Njh2LTguODQ0QzAuOTQsMTkuNDE0LDEuODY5LDE4LjcxNSwzLjAwOSwxOC43MTVMMy4wMDksMTguNzE1eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik00Ny4wNDcsMTguNzE1YzEuMTExLDAsMi4wMTQsMC42OTksMi4wMTQsMS41NjN2OC44NDRjMCwwLjg2NS0wLjkwMiwxLjU2OC0yLjAxNCwxLjU2OGwwLDAgICBjLTEuMTEzLDAtMi4wMTYtMC43MDMtMi4wMTYtMS41Njh2LTguODQ0QzQ1LjAzMSwxOS40MTQsNDUuOTM0LDE4LjcxNSw0Ny4wNDcsMTguNzE1TDQ3LjA0NywxOC43MTV6Ij48L3BhdGg+PC9nPjwvc3ZnPg==';

var d = SVG('drawing');

var button = document.querySelector('.add-rect');
var btnExport = document.querySelector('.export');
var tables = [];
button.onclick = function () {
  var el = d.image(imgTable, 100, 100).draggable({ snapToGrid: 20 });

  function selectUnselect() {
    if (el._memory._selectHandler && el._memory._selectHandler.rectSelection.isSelected) {
      el.selectize(false);
    } else {
      el.selectize({ deepSelect: true, pointSize: 15 }).resize({ snapToGrid: 20, snapToAngle: 90 });
    }
  }

  el.dblclick(selectUnselect);

  var timer = void 0;

  el.touchstart(function () {
    timer = setTimeout(function () {
      selectUnselect();
    }, 1000);
  });

  el.touchend(function () {
    clearTimeout(timer);
  });

  tables.push(el);
};

btnExport.onclick = exportSvg;

function exportSvg() {
  tables.forEach(function (x) {
    x.draggable(false);
    x.selectize(false);
  });
  console.log(d.svg());
}