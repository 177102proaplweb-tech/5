const example = document.getElementById('example')
const answer = document.getElementById('answer')
const capital = document.getElementById('capital')
example.addEventListener("click", function() {
  let cap = capital.value
  if (cap == "") cap = "Warsaw"
  let table = document.createElement('table')
  table.innerHTML = "<tr><th>Name</th><th>Capital</th><th>Population</th><th>Region</th><th>Subregion</th></tr>"
  fetch(`https://restcountries.com/v3.1/capital/${cap}`)
    .then(response => response.json())
    .then(array => {
      console.log(array)
      for (let i = 0; i < array.length; i++) {
        let item = document.createElement('tr')
        item.innerHTML = `<td>${array[i].name.common}</td><td>${array[i].capital[0]}</td><td>${array[i].population}</td><td>${array[i].region}</td><td>${array[i].subregion}</td>`
        table.appendChild(item)
        // console.log("userID:", array[i].userId + ".", "id:", array[i].id + '.', "title:", array[i].title + '.')
      }
    })
  answer.innerHTML = ""
  answer.appendChild(table)
})
