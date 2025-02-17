class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const fieldsItems = ["page", "limit", "sort", "fields"];
    fieldsItems.forEach((el) => delete queryObj[el]);
    this.query = this.query.find(queryObj.filters);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  search(){
    if (this.queryString.search) {
        const search = this.queryString.search
        const searchField = Object.keys(search)[0];
        const searchValue = search[searchField];
        const regex = new RegExp(searchValue, 'i');
        this.query = this.query.find({ [searchField]: regex });
    }else{
        this.query=this.query.select('-__v')
    }
    return this
}
  populate() {
    if (this.queryString.populate) {
      const populateBy = this.queryString.populate.split(",").join(" ");
      this.query = this.query.populate(populateBy);
    }
    return this;
  }
}
export default ApiFeatures;
