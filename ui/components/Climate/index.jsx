import preact, { h } from 'preact';

class Climate extends preact.Component {
	renderInfo() {
		var options,
			props = this.props,
			climate = props.data,
			curMonthNum = ( new Date() ).getMonth();

		options = climate.map( function ( data, i ) {
			return (
				<option value={i} key={'climate-option-' + i}>{data.heading}</option>
			);
		} );

		return (
			<div class="climate">
				<div>
					<h3 class="climate__heading">Average temperatures</h3>
					<input type="range" min="0" max="11"
						title="Slide to change months"
						class="climate__select" value={curMonthNum} disabled/>
					{climate.map(( { precipitation, low, high, imperial, heading }, i ) => {
						return <div class={`climate__details climate__details--${i}`}>
								<h4 class="climate__details__heading">{heading}</h4>
								<span className="climate__high">{high}
									<sup>{imperial ? '°F' : '°C'}</sup></span>
								<span className="climate__low">{low}</span>
								<div>Precipitation: {precipitation} {imperial ? 'inches' : 'mm'}</div>
							</div>;
					})}
				</div>
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
