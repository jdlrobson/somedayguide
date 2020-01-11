import assert from 'assert';

import { climateExtractionWikipedia, climateExtractionNew } from './../../../src/tools/climate';
import domino from 'domino';

const document = domino.createWindow().document;

it('climateExtractionWikipedia', () => {
    [
        // Memphis
        [
            `<table class="wikitable collapsible collapsed mw-collapsible mw-made-collapsible" style="width:100%; text-align:center; line-height: 1.2em; margin:auto;">

            <tbody><tr>
            <th colspan="14"><span class="mw-collapsible-toggle mw-collapsible-toggle-default mw-collapsible-toggle-expanded" role="button" tabindex="0" aria-expanded="true"><a class="mw-collapsible-text">hide</a></span>Climate data for Memphis (<a href="/wiki/Memphis_International_Airport" title="Memphis International Airport">Memphis Int'l</a>), 1981−2010 normals,<sup id="cite_ref-52" class="reference"><a href="#cite_note-52">[52]</a></sup> extremes 1872−present<sup id="cite_ref-53" class="reference"><a href="#cite_note-53">[53]</a></sup>
            </th></tr>
            <tr style="">
            <th scope="row">Month
            </th>
            <th scope="col">Jan
            </th>
            <th scope="col">Feb
            </th>
            <th scope="col">Mar
            </th>
            <th scope="col">Apr
            </th>
            <th scope="col">May
            </th>
            <th scope="col">Jun
            </th>
            <th scope="col">Jul
            </th>
            <th scope="col">Aug
            </th>
            <th scope="col">Sep
            </th>
            <th scope="col">Oct
            </th>
            <th scope="col">Nov
            </th>
            <th scope="col">Dec
            </th>
            <th scope="col" style="border-left-width:medium">Year
            </th></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Record high °F (°C)
            </th>
            <td style="background: #FF6A00; color:#000000;">79<br>(26)
            </td>
            <td style="background: #FF6300; color:#000000;">81<br>(27)
            </td>
            <td style="background: #FF4800; color:#000000;">87<br>(31)
            </td>
            <td style="background: #FF3300; color:#000000;">94<br>(34)
            </td>
            <td style="background: #FF1F00; color:#000000;">99<br>(37)
            </td>
            <td style="background: #FF0A00; color:#FFFFFF;">104<br>(40)
            </td>
            <td style="background: #F80000; color:#FFFFFF;">108<br>(42)
            </td>
            <td style="background: #F80000; color:#FFFFFF;">107<br>(42)
            </td>
            <td style="background: #FF1100; color:#FFFFFF;">103<br>(39)
            </td>
            <td style="background: #FF1F00; color:#000000;">98<br>(37)
            </td>
            <td style="background: #FF4F00; color:#000000;">86<br>(30)
            </td>
            <td style="background: #FF6300; color:#000000;">81<br>(27)
            </td>
            <td style="background: #F80000; color:#FFFFFF; border-left-width:medium">108<br>(42)
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Mean maximum °F (°C)
            </th>
            <td style="background: #FF8C1A; color:#000000;">70.0<br>(21.1)
            </td>
            <td style="background: #FF7D00; color:#000000;">74.0<br>(23.3)
            </td>
            <td style="background: #FF6300; color:#000000;">80.6<br>(27.0)
            </td>
            <td style="background: #FF4F00; color:#000000;">85.9<br>(29.9)
            </td>
            <td style="background: #FF3E00; color:#000000;">90.5<br>(32.5)
            </td>
            <td style="background: #FF2A00; color:#000000;">95.8<br>(35.4)
            </td>
            <td style="background: #FF2100; color:#000000;">98.0<br>(36.7)
            </td>
            <td style="background: #FF1F00; color:#000000;">98.4<br>(36.9)
            </td>
            <td style="background: #FF2E00; color:#000000;">94.6<br>(34.8)
            </td>
            <td style="background: #FF4900; color:#000000;">87.7<br>(30.9)
            </td>
            <td style="background: #FF6800; color:#000000;">79.4<br>(26.3)
            </td>
            <td style="background: #FF8914; color:#000000;">70.7<br>(21.5)
            </td>
            <td style="background: #FF1A00; color:#000000; border-left-width:medium">99.7<br>(37.6)
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Average high °F (°C)
            </th>
            <td style="background: #FFD9B4; color:#000000;">49.8<br>(9.9)
            </td>
            <td style="background: #FFC78F; color:#000000;">54.7<br>(12.6)
            </td>
            <td style="background: #FFA449; color:#000000;">63.9<br>(17.7)
            </td>
            <td style="background: #FF8002; color:#000000;">73.0<br>(22.8)
            </td>
            <td style="background: #FF6100; color:#000000;">81.2<br>(27.3)
            </td>
            <td style="background: #FF4400; color:#000000;">88.9<br>(31.6)
            </td>
            <td style="background: #FF3900; color:#000000;">91.6<br>(33.1)
            </td>
            <td style="background: #FF3B00; color:#000000;">91.3<br>(32.9)
            </td>
            <td style="background: #FF5200; color:#000000;">85.1<br>(29.5)
            </td>
            <td style="background: #FF7B00; color:#000000;">74.4<br>(23.6)
            </td>
            <td style="background: #FFA852; color:#000000;">62.6<br>(17.0)
            </td>
            <td style="background: #FFD0A2; color:#000000;">52.1<br>(11.2)
            </td>
            <td style="background: #FF8206; color:#000000; border-left-width:medium">72.5<br>(22.5)
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Average low °F (°C)
            </th>
            <td style="background: #E8E8FF; color:#000000;">32.6<br>(0.3)
            </td>
            <td style="background: #F3F3FF; color:#000000;">36.3<br>(2.4)
            </td>
            <td style="background: #FFEFE0; color:#000000;">44.1<br>(6.7)
            </td>
            <td style="background: #FFCE9D; color:#000000;">52.9<br>(11.6)
            </td>
            <td style="background: #FFAA55; color:#000000;">62.2<br>(16.8)
            </td>
            <td style="background: #FF8B17; color:#000000;">70.3<br>(21.3)
            </td>
            <td style="background: #FF7E00; color:#000000;">73.8<br>(23.2)
            </td>
            <td style="background: #FF8205; color:#000000;">72.7<br>(22.6)
            </td>
            <td style="background: #FF9F3F; color:#000000;">65.2<br>(18.4)
            </td>
            <td style="background: #FFCA96; color:#000000;">53.8<br>(12.1)
            </td>
            <td style="background: #FFF1E3; color:#000000;">43.7<br>(6.5)
            </td>
            <td style="background: #EFEFFF; color:#000000;">35.1<br>(1.7)
            </td>
            <td style="background: #FFCB97; color:#000000; border-left-width:medium">53.6<br>(12.0)
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Mean minimum °F (°C)
            </th>
            <td style="background: #B3B3FF; color:#000000;">15.0<br>(−9.4)
            </td>
            <td style="background: #C1C1FF; color:#000000;">19.5<br>(−6.9)
            </td>
            <td style="background: #D7D7FF; color:#000000;">27.0<br>(−2.8)
            </td>
            <td style="background: #F3F3FF; color:#000000;">36.1<br>(2.3)
            </td>
            <td style="background: #FFDDBB; color:#000000;">49.0<br>(9.4)
            </td>
            <td style="background: #FFB46A; color:#000000;">59.6<br>(15.3)
            </td>
            <td style="background: #FF9B37; color:#000000;">66.2<br>(19.0)
            </td>
            <td style="background: #FFA347; color:#000000;">64.1<br>(17.8)
            </td>
            <td style="background: #FFD9B3; color:#000000;">50.0<br>(10.0)
            </td>
            <td style="background: #F8F8FF; color:#000000;">37.9<br>(3.3)
            </td>
            <td style="background: #DADAFF; color:#000000;">28.0<br>(−2.2)
            </td>
            <td style="background: #BDBDFF; color:#000000;">18.3<br>(−7.6)
            </td>
            <td style="background: #A7A7FF; color:#000000; border-left-width:medium">10.8<br>(−11.8)
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Record low °F (°C)
            </th>
            <td style="background: #6F6FFF; color:#000000;">−8<br>(−22)
            </td>
            <td style="background: #6565FF; color:#FFFFFF;">−11<br>(−24)
            </td>
            <td style="background: #ABABFF; color:#000000;">12<br>(−11)
            </td>
            <td style="background: #D6D6FF; color:#000000;">27<br>(−3)
            </td>
            <td style="background: #F1F1FF; color:#000000;">36<br>(2)
            </td>
            <td style="background: #FFDFC0; color:#000000;">48<br>(9)
            </td>
            <td style="background: #FFD2A5; color:#000000;">52<br>(11)
            </td>
            <td style="background: #FFDFC0; color:#000000;">48<br>(9)
            </td>
            <td style="background: #F1F1FF; color:#000000;">36<br>(2)
            </td>
            <td style="background: #D1D1FF; color:#000000;">25<br>(−4)
            </td>
            <td style="background: #A0A0FF; color:#000000;">9<br>(−13)
            </td>
            <td style="background: #5F5FFF; color:#FFFFFF;">−13<br>(−25)
            </td>
            <td style="background: #5F5FFF; color:#FFFFFF; border-left-width:medium">−13<br>(−25)
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Average <a href="/wiki/Precipitation" title="Precipitation">precipitation</a> inches (mm)
            </th>
            <td style="background: #68FF68; color:#000000;">3.98<br>(101)
            </td>
            <td style="background: #47FF47; color:#000000;">4.39<br>(112)
            </td>
            <td style="background: #3BFF3B; color:#000000;">5.16<br>(131)
            </td>
            <td style="background: #27FF27; color:#000000;">5.50<br>(140)
            </td>
            <td style="background: #38FF38; color:#000000;">5.25<br>(133)
            </td>
            <td style="background: #71FF71; color:#000000;">3.63<br>(92)
            </td>
            <td style="background: #50FF50; color:#000000;">4.59<br>(117)
            </td>
            <td style="background: #92FF92; color:#000000;">2.88<br>(73)
            </td>
            <td style="background: #86FF86; color:#000000;">3.09<br>(78)
            </td>
            <td style="background: #68FF68; color:#000000;">3.98<br>(101)
            </td>
            <td style="background: #28FF28; color:#000000;">5.49<br>(139)
            </td>
            <td style="background: #25FF25; color:#000000;">5.74<br>(146)
            </td>
            <td style="background: #52FF52; color:#000000; border-left-width:medium">53.68<br>(1,363)
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Average snowfall inches (cm)
            </th>
            <td style="background: #B7B7FF; color:#000000;">1.9<br>(4.8)
            </td>
            <td style="background: #C9C9FF; color:#000000;">1.3<br>(3.3)
            </td>
            <td style="background: #F0F0FF; color:#000000;">0.4<br>(1.0)
            </td>
            <td style="background: #FFFFFF; color:#000000;">0<br>(0)
            </td>
            <td style="background: #FFFFFF; color:#000000;">0<br>(0)
            </td>
            <td style="background: #FFFFFF; color:#000000;">0<br>(0)
            </td>
            <td style="background: #FFFFFF; color:#000000;">0<br>(0)
            </td>
            <td style="background: #FFFFFF; color:#000000;">0<br>(0)
            </td>
            <td style="background: #FFFFFF; color:#000000;">0<br>(0)
            </td>
            <td style="background: #FFFFFF; color:#000000;">0<br>(0)
            </td>
            <td style="background: #FFFFFF; color:#000000;">trace
            </td>
            <td style="background: #F7F7FF; color:#000000;">0.2<br>(0.51)
            </td>
            <td style="background: #F2F2FF; color:#000000; border-left-width:medium">3.8<br>(9.7)
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Average precipitation days <span style="font-size:90%;" class="nowrap">(≥ 0.01 in)</span>
            </th>
            <td style="background: #8989FF; color:#000000;">9.5
            </td>
            <td style="background: #8282FF; color:#000000;">9.2
            </td>
            <td style="background: #7D7DFF; color:#000000;">10.5
            </td>
            <td style="background: #8484FF; color:#000000;">9.6
            </td>
            <td style="background: #7F7FFF; color:#000000;">10.3
            </td>
            <td style="background: #8C8CFF; color:#000000;">9.0
            </td>
            <td style="background: #9292FF; color:#000000;">8.8
            </td>
            <td style="background: #ABABFF; color:#000000;">6.8
            </td>
            <td style="background: #A1A1FF; color:#000000;">7.3
            </td>
            <td style="background: #A2A2FF; color:#000000;">7.5
            </td>
            <td style="background: #8585FF; color:#000000;">9.5
            </td>
            <td style="background: #8787FF; color:#000000;">9.7
            </td>
            <td style="background: #8E8EFF; color:#000000; border-left-width:medium">107.7
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Average snowy days <span style="font-size:90%;" class="nowrap">(≥ 0.1 in)</span>
            </th>
            <td style="background: #F0F0FF; color:#000000;">1.2
            </td>
            <td style="background: #F4F4FF; color:#000000;">0.8
            </td>
            <td style="background: #FAFAFF; color:#000000;">0.4
            </td>
            <td style="background: #FFFFFF; color:#000000;">0
            </td>
            <td style="background: #FFFFFF; color:#000000;">0
            </td>
            <td style="background: #FFFFFF; color:#000000;">0
            </td>
            <td style="background: #FFFFFF; color:#000000;">0
            </td>
            <td style="background: #FFFFFF; color:#000000;">0
            </td>
            <td style="background: #FFFFFF; color:#000000;">0
            </td>
            <td style="background: #FFFFFF; color:#000000;">0
            </td>
            <td style="background: #FFFFFF; color:#000000;">0
            </td>
            <td style="background: #FAFAFF; color:#000000;">0.4
            </td>
            <td style="background: #FCFCFF; color:#000000; border-left-width:medium">2.8
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Average <a href="/wiki/Relative_humidity" title="Relative humidity">relative humidity</a> (%)
            </th>
            <td style="background: #0000F9; color:#FFFFFF;">68.2
            </td>
            <td style="background: #0101FF; color:#FFFFFF;">66.4
            </td>
            <td style="background: #0D0DFF; color:#FFFFFF;">63.2
            </td>
            <td style="background: #0F0FFF; color:#FFFFFF;">62.5
            </td>
            <td style="background: #0101FF; color:#FFFFFF;">66.4
            </td>
            <td style="background: #0000FE; color:#FFFFFF;">66.8
            </td>
            <td style="background: #0000F5; color:#FFFFFF;">69.1
            </td>
            <td style="background: #0000F3; color:#FFFFFF;">69.6
            </td>
            <td style="background: #0000ED; color:#FFFFFF;">71.3
            </td>
            <td style="background: #0101FF; color:#FFFFFF;">66.2
            </td>
            <td style="background: #0000FB; color:#FFFFFF;">67.7
            </td>
            <td style="background: #0000F6; color:#FFFFFF;">68.8
            </td>
            <td style="background: #0000FC; color:#FFFFFF; border-left-width:medium">67.2
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Mean monthly <a href="/wiki/Sunshine_duration" title="Sunshine duration">sunshine hours</a>
            </th>
            <td style="background: #CBCB00; color:#000000;">166.6
            </td>
            <td style="background: #D5D500; color:#000000;">173.8
            </td>
            <td style="background: #DBDB00; color:#000000;">215.3
            </td>
            <td style="background: #E6E600; color:#000000;">254.6
            </td>
            <td style="background: #EEEE0C; color:#000000;">301.5
            </td>
            <td style="background: #F5F51C; color:#000000;">320.6
            </td>
            <td style="background: #F4F41A; color:#000000;">326.9
            </td>
            <td style="background: #F0F00F; color:#000000;">307.0
            </td>
            <td style="background: #E5E500; color:#000000;">251.2
            </td>
            <td style="background: #E2E200; color:#000000;">245.9
            </td>
            <td style="background: #D1D100; color:#000000;">173.0
            </td>
            <td style="background: #C4C408; color:#000000;">151.9
            </td>
            <td style="background: #E2E200; color:#000000; border-left-width:medium">2,888.3
            </td></tr>
            <tr style="text-align: center;">
            <th scope="row" style="height: 16px;">Percent <a href="/wiki/Sunshine_duration" title="Sunshine duration">possible sunshine</a>
            </th>
            <td style="background: #FFFF3F; color:#000000;">53
            </td>
            <td style="background: #FFFF4F; color:#000000;">57
            </td>
            <td style="background: #FFFF53; color:#000000;">58
            </td>
            <td style="background: #FFFF70; color:#000000;">65
            </td>
            <td style="background: #FFFF80; color:#000000;">69
            </td>
            <td style="background: #FFFF94; color:#000000;">74
            </td>
            <td style="background: #FFFF94; color:#000000;">74
            </td>
            <td style="background: #FFFF94; color:#000000;">74
            </td>
            <td style="background: #FFFF7C; color:#000000;">68
            </td>
            <td style="background: #FFFF84; color:#000000;">70
            </td>
            <td style="background: #FFFF4B; color:#000000;">56
            </td>
            <td style="background: #FFFF33; color:#000000;">50
            </td>
            <td style="background: #FFFF70; color:#000000; border-left-width:medium">65
            </td></tr>
            <tr style="">
            <td colspan="14" style="text-align:center;font-size:95%;">Source: NOAA (relative humidity 1961−1990, sun 1961−1987)<sup id="cite_ref-NOWData_54-0" class="reference"><a href="#cite_note-NOWData-54">[54]</a></sup><sup id="cite_ref-NOAA_55-0" class="reference"><a href="#cite_note-NOAA-55">[55]</a></sup><sup id="cite_ref-NOAA_txt_56-0" class="reference"><a href="#cite_note-NOAA_txt-56">[56]</a></sup><sup id="cite_ref-noaasun_57-0" class="reference"><a href="#cite_note-noaasun-57">[57]</a></sup><sup id="cite_ref-Percent_Sunshine_58-0" class="reference"><a href="#cite_note-Percent_Sunshine-58">[58]</a></sup>
            </td></tr></tbody></table>`,
            {
                heading: 'Jan',
                high: 9.9,
                low: 0.3,
                precipitation: 101.1
            }
        ],
        [
            `\n<p>Дангрига знаходиться у зоні тропічного <a href=\"/wiki/Мусонний_клімат\" title=\"Мусонний клімат\">мусонного клімату</a>. Середньорічна температура становить +24 °C. Найспекотніший місяць квітень, коли середня температура становить +26 °C. Найхолодніший місяць січень, з середньою температурою +21 °С. Середньорічна кількість опадів становить 3261 міліметрів. Найбільше опадів випадає у жовтні, в середньому 404 мм. опадів, самий сухий квітень, з 46 мм опадів.</p>\n\n<table style=\"font-size: 90%; margin:0.5em; float:left; clear:left; text-align:center; border:solid 1px silver\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#f9f9f9\">\n<tbody><tr><th colspan=\"12\" style=\"padding:2px;\"><a href=\"/wiki/Клімат\" title=\"Клімат\">Кліматограма</a>   Дангрига\n</th></tr>\n<tr>\n<td>С</td><td>Л</td><td>Б</td><td>К</td><td>Т</td><td>Ч</td><td>Л</td><td>С</td><td>В</td><td>Ж</td><td>Л</td><td>Г</td>\n</tr><tr>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:4.66em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 233\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12em;height:0.4em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:12.4em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 22</small></div>\n<div style=\"color:red;position:absolute;bottom:10.5em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 20</small></div>\n</div></td>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:3.6em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 180\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12em;height:1em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:13em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 25</small></div>\n<div style=\"color:red;position:absolute;bottom:10.5em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 20</small></div>\n</div></td>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:1.98em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 99\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12.4em;height:1.2em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:13.6em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 28</small></div>\n<div style=\"color:red;position:absolute;bottom:10.9em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 22</small></div>\n</div></td>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:0.92em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 46\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12.6em;height:1.2em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:13.8em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 29</small></div>\n<div style=\"color:red;position:absolute;bottom:11.1em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 23</small></div>\n</div></td>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:5.7em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 285\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12.4em;height:1.6em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:14em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 30</small></div>\n<div style=\"color:red;position:absolute;bottom:10.9em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 22</small></div>\n</div></td>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:8.06em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 403\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12.6em;height:0.6em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:13.2em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 26</small></div>\n<div style=\"color:red;position:absolute;bottom:11.1em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 23</small></div>\n</div></td>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:6.1em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 305\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12.4em;height:1em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:13.4em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 27</small></div>\n<div style=\"color:red;position:absolute;bottom:10.9em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 22</small></div>\n</div></td>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:6.04em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 302\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12.8em;height:0.8em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:13.6em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 28</small></div>\n<div style=\"color:red;position:absolute;bottom:11.3em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 24</small></div>\n</div></td>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:7.1em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 355\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12.4em;height:1.2em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:13.6em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 28</small></div>\n<div style=\"color:red;position:absolute;bottom:10.9em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 22</small></div>\n</div></td>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:8.08em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 404\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12.6em;height:0.4em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:13em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 25</small></div>\n<div style=\"color:red;position:absolute;bottom:11.1em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 23</small></div>\n</div></td>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:7.66em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 383\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12.6em;height:0.4em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:13em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 25</small></div>\n<div style=\"color:red;position:absolute;bottom:11.1em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 23</small></div>\n</div></td>\n<td><div style=\"width:2em;height:18em;position:relative;z-index:100;padding:0;margin:0\">\n<div style=\"height:5.95em;bottom:1.92em;width:1.5em;position:absolute;left:0.33em;border-top:dotted 1px #cba;border-bottom:dotted 1px #abc;z-index:3;padding:0;margin:0\"><span>&nbsp;</span></div>\n<div style=\"background:#ace;position:absolute;bottom:2em;left:0.52em;width:1.2em;height:5.3em;z-index:3;overflow:hidden\"><span>&nbsp;</span></div>\n<div style=\"color:blue;position:absolute;bottom:.5em;left:0.34em;width:1.5em;height:1.5em;text-align:center\"><small> 265\n</small></div>\n<div style=\"overflow:hidden;background:#e44;position:absolute;left:0.65em;width:0.9em;z-index:4;bottom:12.4em;height:0.6em;\"><span>&nbsp;</span></div>\n<div style=\"color:red;position:absolute;bottom:13em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 25</small></div>\n<div style=\"color:red;position:absolute;bottom:10.9em; left:0.34em;width:1.5em;height:1.5em;text-align:center;z-index:4\"><small> 22</small></div>\n</div></td>\n</tr>\n<tr><td colspan=\"12\" style=\"padding:2px;text-align:center;font-size:100%;line-height:120%\"><span style=\"color:red\">Температура в °C</span> • <span style=\"color:blue\">Сума опадів у мм</span><br><i><span style=\"color:black\">Джерело:<span> </span><span class=\"mw-ref\" id=\"cite_ref-nasa_4-0\"><a href=\"#cite_note-nasa-4\" style=\"counter-reset: mw-Ref 4;\"><span class=\"mw-reflink-text\">[4]</span></a></span></span></i></td></tr>\n</tbody></table><span>\n</span>\n<p>\n<br></p>\n`,
            {
                heading: 'Jan',
                high: 22,
                low: 20,
                precipitation: 233
            }
        ],
        [
            '<div><table class="wikitable collapsible" style="width:90%; text-align:center; font-size:90%; line-height: 1.2em; margin:auto;"><tbody><tr><th colspan="14">Climate data for Port of Spain, Trinidad and Tobago</th></tr><tr><th scope="row">Month</th><th scope="col">Jan</th><th scope="col">Feb</th><th scope="col">Mar</th><th scope="col">Apr</th><th scope="col">May</th><th scope="col">Jun</th><th scope="col">Jul</th><th scope="col">Aug</th><th scope="col">Sep</th><th scope="col">Oct</th><th scope="col">Nov</th><th scope="col">Dec</th><th scope="col" style="border-left-width:medium">Year</th></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Record high °C (°F)</th><td style="background: #FF3900; color:#000000;">33.2<br> (91.8)</td><td style="background: #FF3A00; color:#000000;">33.0<br> (91.4)</td><td style="background: #FF2D00; color:#000000;">34.9<br> (94.8)</td><td style="background: #FF2D00; color:#000000;">34.9<br> (94.8)</td><td style="background: #FF2A00; color:#000000;">35.3<br> (95.5)</td><td style="background: #FF3000; color:#000000;">34.4<br> (93.9)</td><td style="background: #FF3700; color:#000000;">33.5<br> (92.3)</td><td style="background: #FF3200; color:#000000;">34.2<br> (93.6)</td><td style="background: #FF2200; color:#000000;">36.5<br> (97.7)</td><td style="background: #FF2900; color:#000000;">35.5<br> (95.9)</td><td style="background: #FF3500; color:#000000;">33.8<br> (92.8)</td><td style="background: #FF3900; color:#000000;">33.2<br> (91.8)</td><td style="background: #FF2200; color:#000000; border-left-width:medium">36.5<br> (97.7)</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Average high °C (°F)</th><td style="background: #FF5D00; color:#000000;">28.0<br> (82.4)</td><td style="background: #FF5600; color:#000000;">28.9<br> (84)</td><td style="background: #FF4D00; color:#000000;">30.3<br> (86.5)</td><td style="background: #FF4800; color:#000000;">31.0<br> (87.8)</td><td style="background: #FF3900; color:#000000;">33.1<br> (91.6)</td><td style="background: #FF4400; color:#000000;">31.5<br> (88.7)</td><td style="background: #FF4600; color:#000000;">31.3<br> (88.3)</td><td style="background: #FF4300; color:#000000;">31.7<br> (89.1)</td><td style="background: #FF4000; color:#000000;">32.2<br> (90)</td><td style="background: #FF4000; color:#000000;">32.2<br> (90)</td><td style="background: #FF4400; color:#000000;">31.5<br> (88.7)</td><td style="background: #FF4700; color:#000000;">31.1<br> (88)</td><td style="background: #FF4700; color:#000000; border-left-width:medium">31.1<br> (87.9)</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Average low °C (°F)</th><td style="background: #FFA852; color:#000000;">17.0<br> (62.6)</td><td style="background: #FF9934; color:#000000;">19.2<br> (66.6)</td><td style="background: #FF8F1F; color:#000000;">20.7<br> (69.3)</td><td style="background: #FF860D; color:#000000;">22.0<br> (71.6)</td><td style="background: #FF7F00; color:#000000;">23.0<br> (73.4)</td><td style="background: #FF7D00; color:#000000;">23.3<br> (73.9)</td><td style="background: #FF7F00; color:#000000;">23.0<br> (73.4)</td><td style="background: #FF7F00; color:#000000;">23.0<br> (73.4)</td><td style="background: #FF7E00; color:#000000;">23.1<br> (73.6)</td><td style="background: #FF8205; color:#000000;">22.6<br> (72.7)</td><td style="background: #FF8409; color:#000000;">22.3<br> (72.1)</td><td style="background: #FF8D1B; color:#000000;">21.0<br> (69.8)</td><td style="background: #FF8811; color:#000000; border-left-width:medium">21.7<br> (71)</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Record low °C (°F)</th><td style="background: #FFB973; color:#000000;">14.6<br> (58.3)</td><td style="background: #FFAF5F; color:#000000;">16.1<br> (61)</td><td style="background: #FFAA56; color:#000000;">16.7<br> (62.1)</td><td style="background: #FFA74F; color:#000000;">17.2<br> (63)</td><td style="background: #FF9B38; color:#000000;">18.9<br> (66)</td><td style="background: #FF962D; color:#000000;">19.7<br> (67.5)</td><td style="background: #FF9F40; color:#000000;">18.3<br> (64.9)</td><td style="background: #FF9B38; color:#000000;">18.9<br> (66)</td><td style="background: #FF9831; color:#000000;">19.4<br> (66.9)</td><td style="background: #FF9831; color:#000000;">19.4<br> (66.9)</td><td style="background: #FFA246; color:#000000;">17.9<br> (64.2)</td><td style="background: #FFB164; color:#000000;">15.7<br> (60.3)</td><td style="background: #FFB973; color:#000000; border-left-width:medium">14.6<br> (58.3)</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Average rainfall mm (inches)</th><td style="background: #BFFFBF; color:#000000;">42.9<br> (1.689)</td><td style="background: #BDFFBD; color:#000000;">39.8<br> (1.567)</td><td style="background: #E5FFE5; color:#000000;">16.9<br> (0.665)</td><td style="background: #D4FFD4; color:#000000;">27.7<br> (1.091)</td><td style="background: #9AFF9A; color:#000000;">67.5<br> (2.657)</td><td style="background: #0FFF0F; color:#000000;">155.6<br> (6.126)</td><td style="background: #00DD00; color:#000000;">193.6<br> (7.622)</td><td style="background: #009200; color:#FFFFFF;">244.0<br> (9.606)</td><td style="background: #00D800; color:#000000;">190.5<br> (7.5)</td><td style="background: #29FF29; color:#000000;">143.3<br> (5.642)</td><td style="background: #00B900; color:#FFFFFF;">210.5<br> (8.287)</td><td style="background: #8EFF8E; color:#000000;">75.7<br> (2.98)</td><td style="background: #4CFF4C; color:#000000; border-left-width:medium">1,408<br> (55.433)</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Average rainy days <span style="font-size:90%;" class="nowrap">(≥ 0.1 mm)</span></th><td style="background: #7777FF; color:#000000;">11</td><td style="background: #7777FF; color:#000000;">10</td><td style="background: #B4B4FF; color:#000000;">6</td><td style="background: #B2B2FF; color:#000000;">6</td><td style="background: #7777FF; color:#000000;">11</td><td style="background: #0000FF; color:#FFFFFF;">20</td><td style="background: #0000FA; color:#FFFFFF;">21</td><td style="background: #1414FF; color:#FFFFFF;">19</td><td style="background: #3333FF; color:#FFFFFF;">16</td><td style="background: #4545FF; color:#FFFFFF;">15</td><td style="background: #1919FF; color:#FFFFFF;">18</td><td style="background: #5E5EFF; color:#FFFFFF;">13</td><td style="background: #5151FF; color:#FFFFFF; border-left-width:medium">166</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Average <a href="/wiki/Relative_humidity" title="Relative humidity">relative humidity</a> (%)</th><td style="background: #0000C8; color:#FFFFFF;">81</td><td style="background: #0000CB; color:#FFFFFF;">80</td><td style="background: #0000D7; color:#FFFFFF;">77</td><td style="background: #0000D7; color:#FFFFFF;">77</td><td style="background: #0000CF; color:#FFFFFF;">79</td><td style="background: #0000BC; color:#FFFFFF;">84</td><td style="background: #0000BC; color:#FFFFFF;">84</td><td style="background: #0000BC; color:#FFFFFF;">84</td><td style="background: #0000BC; color:#FFFFFF;">84</td><td style="background: #0000B8; color:#FFFFFF;">85</td><td style="background: #0000B5; color:#FFFFFF;">86</td><td style="background: #0000BC; color:#FFFFFF;">84</td><td style="background: #0000C4; color:#FFFFFF; border-left-width:medium">82</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Mean monthly <a href="/wiki/Sunshine_duration" title="Sunshine duration">sunshine hours</a></th><td style="background: #E1E100; color:#000000;">241.3</td><td style="background: #E3E300; color:#000000;">231.3</td><td style="background: #E2E200; color:#000000;">248.3</td><td style="background: #E2E200; color:#000000;">237.5</td><td style="background: #DFDF00; color:#000000;">233.2</td><td style="background: #D5D500; color:#000000;">183.7</td><td style="background: #D9D900; color:#000000;">205.9</td><td style="background: #DADA00; color:#000000;">212.5</td><td style="background: #D8D800; color:#000000;">197.1</td><td style="background: #D9D900; color:#000000;">207.4</td><td style="background: #D8D800; color:#000000;">197.7</td><td style="background: #DBDB00; color:#000000;">214.5</td><td style="background: #DCDC00; color:#000000; border-left-width:medium">2,610.4</td></tr><tr><td colspan="14" style="text-align:center;font-size:95%;">Source #1: <a href="/wiki/World_Meteorological_Organization" title="World Meteorological Organization">World Meteorological Organization</a><sup id="cite_ref-WMO_15-0" class="reference"><a href="#cite_note-WMO-15">[15]</a></sup></td></tr><tr><td colspan="14" style="text-align:center; font-size:95%;">Source #2: NOAA (sun, extremes and humidity)<sup id="cite_ref-NOAA_16-0" class="reference"><a href="#cite_note-NOAA-16">[16]</a></sup></td></tr></tbody></table></div>',
            {
                heading: 'Jan',
                high: 28,
                low: 17,
                precipitation: 42.9
            },
            {
                heading: 'Dec',
                high: 31.1,
                low: 21,
                precipitation: 75.7
            }
        ],
        [
            '<table class="wikitable collapsible mw-collapsible mw-made-collapsible" style="width:90%; text-align:center; font-size:90%; line-height: 1.2em; margin:auto;"><tbody><tr><th colspan="14"><span class="mw-collapsible-toggle mw-collapsible-toggle-default" role="button" tabindex="0"><a class="mw-collapsible-text">Collapse</a></span>Climate data for Pyongyang (1971–2000, extremes 1907–2016)</th></tr><tr><th scope="row">Month</th><th scope="col">Jan</th><th scope="col">Feb</th><th scope="col">Mar</th><th scope="col">Apr</th><th scope="col">May</th><th scope="col">Jun</th><th scope="col">Jul</th><th scope="col">Aug</th><th scope="col">Sep</th><th scope="col">Oct</th><th scope="col">Nov</th><th scope="col">Dec</th><th scope="col" style="border-left-width:medium">Year</th></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Record high °C (°F)</th><td style="background: #FFD2A5; color:#000000;">11.0<br> (51.8)</td><td style="background: #FFB061; color:#000000;">15.9<br> (60.6)</td><td style="background: #FF8206; color:#000000;">22.5<br> (72.5)</td><td style="background: #FF5400; color:#000000;">29.3<br> (84.7)</td><td style="background: #FF2B00; color:#000000;">35.2<br> (95.4)</td><td style="background: #FF1E00; color:#000000;">37.1<br> (98.8)</td><td style="background: #FF1D00; color:#000000;">37.2<br> (99)</td><td style="background: #FF2100; color:#000000;">36.7<br> (98.1)</td><td style="background: #FF2F00; color:#000000;">34.6<br> (94.3)</td><td style="background: #FF5600; color:#000000;">28.9<br> (84)</td><td style="background: #FF7E00; color:#000000;">23.2<br> (73.8)</td><td style="background: #FFBB77; color:#000000;">14.3<br> (57.7)</td><td style="background: #FF1D00; color:#000000; border-left-width:medium">37.2<br> (99)</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Average high °C (°F)</th><td style="background: #E2E2FF; color:#000000;">−0.8<br> (30.6)</td><td style="background: #F3F3FF; color:#000000;">2.4<br> (36.3)</td><td style="background: #FFE0C2; color:#000000;">8.9<br> (48)</td><td style="background: #FFA851; color:#000000;">17.1<br> (62.8)</td><td style="background: #FF8205; color:#000000;">22.6<br> (72.7)</td><td style="background: #FF6600; color:#000000;">26.7<br> (80.1)</td><td style="background: #FF5800; color:#000000;">28.6<br> (83.5)</td><td style="background: #FF5600; color:#000000;">28.9<br> (84)</td><td style="background: #FF7300; color:#000000;">24.7<br> (76.5)</td><td style="background: #FFA042; color:#000000;">18.2<br> (64.8)</td><td style="background: #FFDDBB; color:#000000;">9.4<br> (48.9)</td><td style="background: #EFEFFF; color:#000000;">1.7<br> (35.1)</td><td style="background: #FFB164; color:#000000; border-left-width:medium">15.7<br> (60.3)</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Daily mean °C (°F)</th><td style="background: #C7C7FF; color:#000000;">−5.8<br> (21.6)</td><td style="background: #D8D8FF; color:#000000;">−2.7<br> (27.1)</td><td style="background: #FAFAFF; color:#000000;">3.6<br> (38.5)</td><td style="background: #FFD2A5; color:#000000;">11.0<br> (51.8)</td><td style="background: #FFAA55; color:#000000;">16.8<br> (62.2)</td><td style="background: #FF8913; color:#000000;">21.6<br> (70.9)</td><td style="background: #FF7300; color:#000000;">24.7<br> (76.5)</td><td style="background: #FF7300; color:#000000;">24.7<br> (76.5)</td><td style="background: #FF9730; color:#000000;">19.5<br> (67.1)</td><td style="background: #FFC790; color:#000000;">12.5<br> (54.5)</td><td style="background: #FFFEFD; color:#000000;">4.6<br> (40.3)</td><td style="background: #D7D7FF; color:#000000;">−2.8<br> (27)</td><td style="background: #FFD4A9; color:#000000; border-left-width:medium">10.7<br> (51.3)</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Average low °C (°F)</th><td style="background: #ACACFF; color:#000000;">−10.7<br> (12.7)</td><td style="background: #BCBCFF; color:#000000;">−7.8<br> (18)</td><td style="background: #DDDDFF; color:#000000;">−1.8<br> (28.8)</td><td style="background: #FFFCF9; color:#000000;">4.9<br> (40.8)</td><td style="background: #FFD2A6; color:#000000;">10.9<br> (51.6)</td><td style="background: #FFAC59; color:#000000;">16.5<br> (61.7)</td><td style="background: #FF8F1F; color:#000000;">20.7<br> (69.3)</td><td style="background: #FF9022; color:#000000;">20.5<br> (68.9)</td><td style="background: #FFBB77; color:#000000;">14.3<br> (57.7)</td><td style="background: #FFEFE0; color:#000000;">6.7<br> (44.1)</td><td style="background: #E5E5FF; color:#000000;">−0.3<br> (31.5)</td><td style="background: #BFBFFF; color:#000000;">−7.2<br> (19)</td><td style="background: #FFF7EF; color:#000000; border-left-width:medium">5.6<br> (42.1)</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Record low °C (°F)</th><td style="background: #4C4CFF; color:#FFFFFF;">−28.5<br> (−19.3)</td><td style="background: #6868FF; color:#FFFFFF;">−23.4<br> (−10.1)</td><td style="background: #8181FF; color:#000000;">−18.8<br> (−1.8)</td><td style="background: #CECEFF; color:#000000;">−4.5<br> (23.9)</td><td style="background: #EEEEFF; color:#000000;">1.4<br> (34.5)</td><td style="background: #FFEDDC; color:#000000;">7.0<br> (44.6)</td><td style="background: #FFC993; color:#000000;">12.3<br> (54.1)</td><td style="background: #FFC993; color:#000000;">12.3<br> (54.1)</td><td style="background: #F5F5FF; color:#000000;">2.7<br> (36.9)</td><td style="background: #C3C3FF; color:#000000;">−6.6<br> (20.1)</td><td style="background: #7B7BFF; color:#000000;">−19.9<br> (−3.8)</td><td style="background: #4343FF; color:#FFFFFF;">−30.2<br> (−22.4)</td><td style="background: #4343FF; color:#FFFFFF; border-left-width:medium">−30.2<br> (−22.4)</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Average <a href="/wiki/Precipitation" title="Precipitation">precipitation</a> mm (inches)</th><td style="background: #ECFFEC; color:#000000;">12.2<br> (0.48)</td><td style="background: #EDFFED; color:#000000;">11.0<br> (0.433)</td><td style="background: #DAFFDA; color:#000000;">24.7<br> (0.972)</td><td style="background: #B2FFB2; color:#000000;">49.9<br> (1.965)</td><td style="background: #93FF93; color:#000000;">72.2<br> (2.843)</td><td style="background: #73FF73; color:#000000;">90.3<br> (3.555)</td><td style="background: #006300; color:#FFFFFF;">275.2<br> (10.835)</td><td style="background: #00C000; color:#FFFFFF;">212.8<br> (8.378)</td><td style="background: #64FF64; color:#000000;">100.2<br> (3.945)</td><td style="background: #C3FFC3; color:#000000;">39.9<br> (1.571)</td><td style="background: #C9FFC9; color:#000000;">34.9<br> (1.374)</td><td style="background: #E6FFE6; color:#000000;">16.5<br> (0.65)</td><td style="background: #88FF88; color:#000000; border-left-width:medium">939.8<br> (37)</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Average precipitation days <span style="font-size:90%;" class="nowrap">(≥ 0.1 mm)</span></th><td style="background: #BEBEFF; color:#000000;">5.2</td><td style="background: #C6C6FF; color:#000000;">4.2</td><td style="background: #C0C0FF; color:#000000;">5.1</td><td style="background: #A9A9FF; color:#000000;">6.7</td><td style="background: #9B9BFF; color:#000000;">8.1</td><td style="background: #9090FF; color:#000000;">8.7</td><td style="background: #4D4DFF; color:#FFFFFF;">14.4</td><td style="background: #7777FF; color:#000000;">11.0</td><td style="background: #A3A3FF; color:#000000;">7.2</td><td style="background: #B3B3FF; color:#000000;">6.1</td><td style="background: #A1A1FF; color:#000000;">7.3</td><td style="background: #B6B6FF; color:#000000;">5.9</td><td style="background: #A0A0FF; color:#000000; border-left-width:medium">89.9</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Average <a href="/wiki/Relative_humidity" title="Relative humidity">relative humidity</a> (%)</th><td style="background: #0000E2; color:#FFFFFF;">74</td><td style="background: #0000EE; color:#FFFFFF;">71</td><td style="background: #0202FF; color:#FFFFFF;">66</td><td style="background: #0E0EFF; color:#FFFFFF;">63</td><td style="background: #0202FF; color:#FFFFFF;">66</td><td style="background: #0000F2; color:#FFFFFF;">70</td><td style="background: #0000CB; color:#FFFFFF;">80</td><td style="background: #0000D3; color:#FFFFFF;">78</td><td style="background: #0000E2; color:#FFFFFF;">74</td><td style="background: #0000EA; color:#FFFFFF;">72</td><td style="background: #0000EA; color:#FFFFFF;">72</td><td style="background: #0000E6; color:#FFFFFF;">73</td><td style="background: #0000EA; color:#FFFFFF; border-left-width:medium">72</td></tr><tr style="text-align: center;"><th scope="row" style="height: 16px;">Mean monthly <a href="/wiki/Sunshine_duration" title="Sunshine duration">sunshine hours</a></th><td style="background: #D3D300; color:#000000;">184</td><td style="background: #DBDB00; color:#000000;">197</td><td style="background: #DEDE00; color:#000000;">231</td><td style="background: #E1E100; color:#000000;">237</td><td style="background: #E6E600; color:#000000;">263</td><td style="background: #E0E000; color:#000000;">229</td><td style="background: #D2D200; color:#000000;">181</td><td style="background: #D8D800; color:#000000;">204</td><td style="background: #DEDE00; color:#000000;">222</td><td style="background: #DADA00; color:#000000;">214</td><td style="background: #CDCD00; color:#000000;">165</td><td style="background: #CACA00; color:#000000;">165</td><td style="background: #DADA00; color:#000000; border-left-width:medium">2,492</td></tr><tr><td colspan="14" style="text-align:center;font-size:95%;">Source #1: <a href="/wiki/World_Meteorological_Organization" title="World Meteorological Organization">World Meteorological Organization</a><sup id="cite_ref-36" class="reference"><a href="#cite_note-36">[34]</a></sup></td></tr><tr><td colspan="14" style="text-align:center; font-size:95%;">Source #2: Deutscher Wetterdienst (extremes, humidity 1908–1936, and sun 1961–1990)<sup id="cite_ref-37" class="reference"><a href="#cite_note-37">[35]</a></sup><sup id="cite_ref-DWDsun_38-0" class="reference"><a href="#cite_note-DWDsun-38">[36]</a></sup><sup id="cite_ref-39" class="reference"><a href="#cite_note-39">[c]</a></sup></td></tr></tbody></table>',
            {
                heading: 'Jan',
                high: -0.8,
                low: -10.7,
                precipitation: 12.2
            }
        ],
        [
            `<div style="float:right;clear:right;margin-left: 0.5em" class="climate-table right">
            <table class="infobox" style="width: 19.5em; float: none; clear: none; text-align: center; border: solid 1px silver" cellspacing="0" cellpadding="0">
            <tbody><tr><th> Kaprun
            </th></tr>
            <tr><th style="font-size: 90%">Climate chart (<a href="/wiki/Template:Climate_chart/How_to_read_a_climate_chart" title="Template:Climate chart/How to read a climate chart">explanation</a>)</th></tr>
            <tr><td><table class="infobox" style="width: 100%; margin: 0; float: none; clear: none; text-align: center; border: none; font-size: 90%; flex-flow: row nowrap" cellspacing="0" cellpadding="0">
            <tbody><tr><td>J</td><td>F</td><td>M</td><td>A</td><td>M</td><td>J</td><td>J</td><td>A</td><td>S</td><td>O</td><td>N</td><td>D</td></tr>
            <tr>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">50</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:7em;height:0.8em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:7.8em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">−1</span></div>
            <div style="color:red;position:absolute;bottom:5.5em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">−5</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.2em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">60</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:7em;height:1.6em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:8.6em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">3</span></div>
            <div style="color:red;position:absolute;bottom:5.5em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">−5</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.6em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">80</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:7.8em;height:2em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:9.8em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">9</span></div>
            <div style="color:red;position:absolute;bottom:6.3em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">−1</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.8em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">90</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:8.4em;height:2.4em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:10.8em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">14</span></div>
            <div style="color:red;position:absolute;bottom:6.9em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">2</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:2.2em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">110</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:9.2em;height:2.4em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:11.6em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">18</span></div>
            <div style="color:red;position:absolute;bottom:7.7em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">6</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:2.6em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">130</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:9.8em;height:2.6em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:12.4em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">22</span></div>
            <div style="color:red;position:absolute;bottom:8.3em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">9</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:2.8em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">140</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:10em;height:2.6em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:12.6em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">23</span></div>
            <div style="color:red;position:absolute;bottom:8.5em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">10</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:2.6em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">130</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:10.2em;height:2.4em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:12.6em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">23</span></div>
            <div style="color:red;position:absolute;bottom:8.7em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">11</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:2em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">100</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:9.8em;height:1.8em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:11.6em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">18</span></div>
            <div style="color:red;position:absolute;bottom:8.3em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">9</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.8em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">90</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:9em;height:1.4em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:10.4em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">12</span></div>
            <div style="color:red;position:absolute;bottom:7.5em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">5</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.4em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">70</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:7.8em;height:1.2em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:9em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">5</span></div>
            <div style="color:red;position:absolute;bottom:6.3em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">−1</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.2em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">60</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust: exact;color-adjust: exact;position:absolute;left:.25em;width:1.1em;bottom:7.4em;height:0.4em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:7.8em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">−1</span></div>
            <div style="color:red;position:absolute;bottom:5.9em; left:-.4em;width:1.6em;height:1.5em;text-align:right"><span style="font-size:80%">−3</span></div>
            </div></td>
            </tr>
            <tr><td colspan="12" style="padding: 2px; text-align: left; line-height: 1.5em; color: red">Average max. and min. temperatures in °C</td></tr>
            <tr><td colspan="12" style="padding: 2px; text-align: left; line-height: 1.5em"><span style="color: blue">Precipitation</span>+<span style="color: #abc">Snow</span> totals in mm</td></tr><tr><td colspan="12" style="padding: 2px; text-align: left; line-height: 1.5em"><i>See the Kaprun forecast at <a rel="nofollow" class="external text" href="https://www.holiday-weather.com/kaprun_at/averages/">Annual Weather Averages</a></i></td></tr>
            </tbody></table></td></tr>
            <tr><td>
            <table class="infobox mw-collapsible mw-collapsed mw-made-collapsible" style="width: 100%; margin: 0; float: none; clear: none; text-align: center; border: none; font-size: 90%; flex-flow: row nowrap" cellspacing="0" cellpadding="0">
            <tbody><tr><th colspan="12"><span class="mw-collapsible-toggle mw-collapsible-toggle-default mw-collapsible-toggle-collapsed" role="button" tabindex="0" aria-expanded="false"><a class="mw-collapsible-text">Expand</a></span>Imperial conversion</th></tr>
            <tr style="display: none;"><td>J</td><td>F</td><td>M</td><td>A</td><td>M</td><td>J</td><td>J</td><td>A</td><td>S</td><td>O</td><td>N</td><td>D</td></tr>
            <tr style="display: none;">
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">2</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:7em;height:0.8em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:7.8em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">30</span></div>
            <div style="color:red;position:absolute;bottom:5.5em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">23</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.2em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">2.4</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:7em;height:1.6em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:8.6em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">37</span></div>
            <div style="color:red;position:absolute;bottom:5.5em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">23</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.6em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">3.1</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:7.8em;height:2em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:9.8em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">48</span></div>
            <div style="color:red;position:absolute;bottom:6.3em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">30</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.8em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">3.5</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:8.4em;height:2.4em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:10.8em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">57</span></div>
            <div style="color:red;position:absolute;bottom:6.9em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">36</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:2.2em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">4.3</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:9.2em;height:2.4em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:11.6em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">64</span></div>
            <div style="color:red;position:absolute;bottom:7.7em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">43</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:2.6em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">5.1</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:9.8em;height:2.6em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:12.4em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">72</span></div>
            <div style="color:red;position:absolute;bottom:8.3em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">48</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:2.8em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">5.5</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:10em;height:2.6em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:12.6em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">73</span></div>
            <div style="color:red;position:absolute;bottom:8.5em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">50</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:2.6em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">5.1</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:10.2em;height:2.4em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:12.6em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">73</span></div>
            <div style="color:red;position:absolute;bottom:8.7em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">52</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:2em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">3.9</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:9.8em;height:1.8em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:11.6em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">64</span></div>
            <div style="color:red;position:absolute;bottom:8.3em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">48</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.8em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">3.5</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:9em;height:1.4em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:10.4em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">54</span></div>
            <div style="color:red;position:absolute;bottom:7.5em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">41</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.4em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">2.8</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:7.8em;height:1.2em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:9em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">41</span></div>
            <div style="color:red;position:absolute;bottom:6.3em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">30</span></div>
            </div></td>
            <td>
            <div style="width:1.6em;height:17em;position:relative;padding:0;margin:0">
            <div style="height:0em;bottom:2em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #abc;padding:0;margin:0">&nbsp;</div>
            <div style="background:#def;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:0em;overflow:hidden">&nbsp;</div>
            <div style="background:#ace;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;bottom:2em;left:.2em;width:1.2em;height:1.2em;overflow:hidden">&nbsp;</div>
            <div style="color:blue;position:absolute;bottom:.5em;left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:70%">2.4</span></div>
            <div style="height:0em;bottom:8em;width:1.6em;position:absolute;left:0;border-bottom:dotted 1px #cba;padding:0;margin:0">&nbsp;</div>
            <div style="overflow:hidden;background:#e44;-webkit-print-color-adjust:exact;color-adjust:exact;position:absolute;left:.25em;width:1.1em;bottom:7.4em;height:0.4em;">&nbsp;</div>
            <div style="color:red;position:absolute;bottom:7.8em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">30</span></div>
            <div style="color:red;position:absolute;bottom:5.9em; left:0;width:1.6em;height:1.5em;text-align:center"><span style="font-size:80%">27</span></div>
            </div></td>
            </tr>
            <tr style="display: none;"><td colspan="12" style="padding: 2px; text-align: left; line-height: 1.5em; color: red">Average max. and min. temperatures in °F</td></tr>
            <tr style="display: none;"><td colspan="12" style="padding: 2px; text-align: left; line-height: 1.5em"><span style="color: blue">Precipitation</span>+<span style="color: #abc">Snow</span> totals in inches</td></tr>
            </tbody></table>
            </td></tr></tbody></table>
            </div>`,
            {
                heading: 'Jan',
                high: -1,
                low: -5,
                precipitation: 50
            }
        ]
    ].forEach( ( test ) => {
        const climate = climateExtractionWikipedia( document, test[ 0 ] );
        assert.strictEqual( climate.length, 12 );
        assert.deepStrictEqual( climate[ 0 ], test[ 1 ] );
    } );
} );
