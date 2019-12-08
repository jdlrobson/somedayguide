import { climateToWikiText, climateExtraction } from './climate.js';

/**
 * 
 * @param {Element} tool 
 */
function climate(tool) {
    const climateBtn = tool.querySelector('button');
    const output = tool.querySelector('textarea');
    const pre = tool.querySelector('pre');
    const host = tool.querySelector('select').value;

    climateBtn.removeAttribute('disabled');
    climateBtn.addEventListener('click', function () {
        climateBtn.setAttribute('disabled', '');
        const from = tool.querySelector('input').value;
        pre.textContent = '';
        output.value = '';
       climateExtraction(host, from).then((climateData) => {
           if ( climateData ) {
                output.value = climateToWikiText(
                    climateData,
                    from
                );
                pre.textContent = JSON.stringify(climateData);
           } else {
               output.value = 'n/a';
           }
           climateBtn.removeAttribute('disabled');
       })
    });
}
climate(document.getElementById('climate-tool'))