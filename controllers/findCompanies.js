const Company = require("../model/company");

const companyCard = (cName, package, position, description, website) => {
  return card =
    `
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">${cName}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${package} LPA</h6>
        <h6 class="card-subtitle mb-2 text-muted">${position}</h6>
        <p class="card-text">${description}</p>
        <a href="${website}" class="card-link" target=_blank>${website}</a>
      </div>
    </div>
    `
}

let html = `
  
`

const findCompanies = async function (req, res) {
  const { email, cpi, age, name, description, package, position, website } = req.user;

  const foundCompanies = await Company.find({ $and: [{ 'cpi': { $lte: cpi } }, { 'age': { $lte: age } }] }).exec();
  console.log(foundCompanies);

  // let html=``;

  foundCompanies.forEach(company => {
    html = html + companyCard(company.name, company.package, company.position, company.description, company.website);
  });

  // const html = companyCard(foundCompanies[0].name, foundCompanies[0].package, foundCompanies[0].position, foundCompanies[0].description, foundCompanies[0].website);

  res.type('html').send(html);
}

module.exports = { findCompanies };