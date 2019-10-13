import preact from 'preact';

class Climate extends preact.Component {
	onChange( ev ) {
		this.setState( { month: ev.currentTarget.value } );
	}
	constructor( props ) {
		super( props );
		this.state = {
			month: props.month
		};
	}
	componentDidMount() {
		this.setState( { month: this.getCurrentMonth() } );
	}
	getCurrentMonth() {
		return ( new Date() ).getMonth();
	}
	renderInfo() {
		var options,
			props = this.props,
			climate = props.data,
			curMonthNum = this.state.month || this.getCurrentMonth(),
			curMonth = climate[ curMonthNum ],
			degSuffix = curMonth.imperial ? '°F' : '°C',
			precSuffix = curMonth.imperial ? 'inches' : 'mm';

		options = climate.map( function ( data, i ) {
			return (
				<option value={i} key={'climate-option-' + i}>{data.heading}</option>
			);
		} );

		return (
			<div className="climate hydratable"
				data-component="climate"
				data-props={JSON.stringify( props )}>
				<div>
					<select class="climate__select" value={curMonthNum}
						disabled={this.state.month === undefined}
						onChange={this.onChange.bind( this )}>{options}</select>
					<h4>Average temperatures</h4>
					<span className="climate__high">{curMonth.high}<sup>{degSuffix}</sup></span>
					<span className="climate__low">{curMonth.low}</span>
				</div>
				<div>Precipitation: { curMonth.precipitation} {precSuffix}</div>
			</div>
		);
	}
	render() {
		const { data } = this.props;
		if ( data ) {
			return this.renderInfo();
		} else {
			return ( <div class="climate"><p>No climate information is available for this destination.</p></div> );
		}
	}
}

export default Climate;
