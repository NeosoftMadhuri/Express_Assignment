const express = require('express');
const fs = require('fs')
const PORT = 6677;

const file = fs.readFileSync('empdata.json')
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const dataPath = 'empdata.json' 

const getEmpData = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)   
}
const saveEmpData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

app.get("/addemplyoee", (req, res) => {
    res.sendFile('Form.html', { root: '.' })
})
app.post('/submit-data', (req, res) => {
    console.log(req.body)
    var existData= getEmpData()
    var userData = req.body
    existData.push(userData)
    console.log(existData);

    saveEmpData(existData);
    res.redirect('/');

})

app.get('/submit-data',(req,res)=>{
    res.sendFile('Form.html',{root:'.'})
})
app.get("/", (req, res) => {
    let data=fs.readFileSync('Empdetails.html')
    let list = fs.readFileSync('empdata.json')
   let arr=JSON.parse(list)
   let empList=[]
   arr.map(val=>empList.push(val))
   let body=''
   empList.map(val=>
    body+=`<tr><td>${val.id}</td><td>${val.name}</td><td>${val.age}</td><td>${val.salary}</td><td>${val.city}</td>
    <td><button type="button" class="btn btn-danger"><a href="/deleteemp/${val.id}" style="text-decoration: none;color:white">Delete</a></button>
    <button type="submit" class="btn btn-warning ml-2"><a href="/editemp/${val.id}" style="text-decoration: none;color:white">Update</a></button></td>
    </tr>`
    )
    res.send(`${data} ${body} 
    </tbody>
    </table>`
    
    )
})

app.get('/editemp/:id',(req,res)=>{
    console.log(req.params.id)
    var existData=getEmpData()
    var updateData=existData.filter(user=>user.id==req.params.id)
    console.log(updateData)
    let data = `<html>
    <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    </head>
    <body>
    <div class="container">
          <div class="row">
              <div class="col-sm-3 col-md-3 col-lg-3"></div>
              <div class="col-sm-6 col-md-6 col-lg-6">
                <h3>Employee Data</h3>
                <form method="POST"action="/${updateData.id}?_method=PUT">
                    <div class="mb-3">
                      <label for="id" class="form-label">Employee Id</label>
                      <input type="text" class="form-control" id="id" name="id" value="${updateData[0].id}">
                    </div>
                    <div class="mb-3">
                        <label for="name" class="form-label">Employee name</label>
                        <input type="text" class="form-control" id="name" name="name"value="${updateData[0].name}" >
                      </div>
                      <div class="mb-3">
                        <label for="age" class="form-label">Employee age</label>
                        <input type="text" class="form-control" id="age" name="age"value="${updateData[0].age}" >
                      </div>
                      <div class="mb-3">
                        <label for="salary" class="form-label">Employee salary</label>
                        <input type="text" class="form-control" id="salary" name="salary"value="${updateData[0].salary}" >
                      </div>
                      <div class="mb-3">
                        <label for="city" class="form-label">Employee city</label>
                        <input type="text" class="form-control" id="city" name="city"value="${updateData[0].city}" >
                      </div>
                    
                    <button type="submit" class="btn btn-primary">Submit</button>
                  </form>
              </div>
              <div class="col-sm-3 col-md-3 col-lg-3"></div>

          </div>
      </div>
   
        
    </body>
    </html>`;
    res.write(data)
   
})
app.post('/:id', (req, res) => {
    const { id } = req.params;
    console.log(id)
    const employees = getEmpData();
    const index = employees.findIndex(pt => pt.id == id);
    employees.splice(index, 1)

    const empData = req.body
    employees.push(empData)
    saveEmpData(employees)
    res.redirect('/')
})
app.get('/deleteemp/:id',(req,res)=>{
    console.log(req.params.id)
    var existData=getEmpData()
    console.log(existData)
    var newdata=existData.filter(user=>user.id!==req.params.id)
    console.log(newdata)
    saveEmpData(newdata)
     res.redirect('/');
})
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`http://localhost:${PORT}`)
})