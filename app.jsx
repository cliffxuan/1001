class Album extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isChecked: false};
  }
  handleChange() {
    this.setState({isChecked: !this.state.isChecked});
  }
  render () {
    var image = _.chain(this.props.images)
      .filter(x => Math.abs(x.width - 300) < 100)
      .first().value();
    return (
      <section className="flip-item-wrap">
        <img className="fake-image" src="record.jpg" alt="" />
        <input type="checkbox" className="flipper" id={this.props.id} onChange={this.handleChange.bind(this)} checked={this.state.isChecked} hidden />
        <label htmlFor={this.props.id} className="flip-item">
          <figure className="front"><img src={image.url} alt=""></img></figure>
          <figure className="back">
            <img src={image.url} alt=""></img>
            <div className="flip-item-desc">
              <h4 className="flip-item-title">{this.props.name}</h4>
              <p>{new Date(Date.parse(this.props.release_date)).getFullYear()}</p>
              <a className="artist-link" href={this.props.artists[0].uri}><p>{this.props.artists[0].name}</p></a>
              <a className="play-button" href={this.props.uri}><i className="fa fa-play-circle-o fa-4x"></i></a>
            </div>
          </figure>
        </label>
      </section>
    );
  }
}

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
    this.setState({years: years});
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

  render() {
    var ids = this._randomPick(this.state.albums, [1980], 10);
    return (
      <div id="albums">
        <YearMenu handleUpdate={this.handleYearUpdate.bind(this)} all_years={this.all_years} />
        <div className="grids">
          {ids.map(id => React.createElement(Album, this.state.albums[id]))}
        </div>
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
  }

  render() {
    return (
      <div className="pure-menu pure-menu-horizontal fixed-top">
        <label className="pure-menu-heading">Release Year</label>
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
    var labelStyle;
    if (this.state.selected) {
      labelStyle = { backgroundColor: '#d8d8d8' };
    } else {
      labelStyle = {};
    }
    return (
      <li className="pure-menu-item" onChange={this.onChange.bind(this)} >
        <label style={labelStyle} className="pure-menu-link toggle">
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
