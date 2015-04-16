class Albums extends React.Component {

  constructor() {
    this.all_years = [1950, 1960, 1970, 1980, 1990, 2000, 2010];
    this.state = {years: this.all_years};
  }  

  componentDidMount () {
    superagent.get(this.props.source)
      .end(function(res) {
        this.setState({albums: res.body});
      }.bind(this));
  }

  handleYearUpdate (years) {
    console.log('years: ' + years.join(', '));
    this.setState({years: years});
  }

  render() {
    var ids = this._randomPick(this.state.albums, this.state.years, 100);
    // console.log(ids);
    return (
      <div id="albums">
        <YearMenu handleUpdate={this.handleYearUpdate.bind(this)} all_years={this.all_years} />
        <div className="pure-g">
          {ids.map(id => React.createElement(Album, this.state.albums[id]))}
        </div>
      </div>
    );
  }

  _randomPick(albums, years, cnt) {
    var ids = _.chain(albums)
      .keys()
      .filter(id => _.any(years.map(year => {
                          var release_year = new Date(Date.parse(albums[id].release_date)).getFullYear(),
                              diff = release_year - year;
                          return 0 <  diff && diff <  10;})))
      .sort(x => 0.5 - Math.random())
      .slice(0, cnt)
      .value();
    return ids;
  }

}

class Album extends React.Component {
  render() {
    return (
        <div className="pure-u-1 pure-u-sm-1-2 pure-u-md-1-3 pure-u-lg-1-4 pure-u-xl-1-5">
          <a href={this.props.uri}>
            <img className="pure-img" src={this.props.images[1].url} />
          </a>
        </div>
    );
  }
}

class YearMenu extends React.Component {

  constructor() {
    this.state = {years: []};
  }

  handleClick(year, checked) {
    var years = this.state.years;
    if (checked) {
      years.push(year);
    } else {
      years = years.filter(x => x != year);
    }
    this.props.handleUpdate(years.length > 0 ? years : this.props.all_years);
    this.setState({years: years});
    // console.log('years: ' + years.join(', '));
  }

  render() {
    return (
      <div className="pure-menu pure-menu-horizontal pure-menu-scrollable">
        <label className="pure-menu-link pure-menu-heading">Release Year</label>
        <ul className="pure-menu-list">
          {this.props.all_years.map(year => React.createElement(
              YearButton, {year: year, handleClick: this.handleClick.bind(this)}))}
        </ul>
      </div>
        );
  }
}

class YearButton extends React.Component {

  constructor() {
    this.state = {selected: false};
  }

  onChange() {
    var selected = !this.state.selected;
    this.setState({selected: selected});
    this.props.handleClick(this.props.year, selected);
  }

  render() {
    if (this.state.selected) {
      var labelStyle = { backgroundColor: '#d8d8d8' };
    } else {
      var labelStyle = {};
    }
    return (
      <li className="pure-menu-item" onChange={this.onChange.bind(this)} >
          <label style={labelStyle} className="pure-menu-link">
            <input name="years" type="checkbox"
             checked={this.state.selected} value={this.props.year} hidden/>
            {this.props.year}s
          </label>
      </li>
    );
  }
}

React.render(<Albums source="data.json" />,
             document.getElementById('container'));
