
export function isInstanceOfSight( claims ) {
    return [
        // observatory
        'Q1254933',
        // oldtown
        'Q676050', 'Q15243209',
        // casino
        'Q133215',
        // tower
        'Q1440300', 'Q12518', 'Q853854', 'Q11166728',
        // cultural property
        'Q2065736', 'Q8346700', 'Q1329623',
        // masouleum, memorial
        'Q162875', 'Q5003624', 'Q1967454',
        // historic site
        'Q1081138',
        // 'arch'
        'Q143912',
        // archives
        'Q166118',
        // skyscraper
        'Q11303',
        // business
        'Q4830453', 'Q738570', 'Q891723',
        // dam
        'Q12323', 'Q3497167',
        // festival
        'Q220505', 'Q868557', 'Q132241',
        // biome
        'Q101998',
        // former region
        'Q22670030',
        // museum
        'Q33506', 'Q207694', 'Q17431399', 'Q1863818', 'Q1970365', 'Q2772772',
        'Q16735822', 'Q2087181', 'Q588140', 'Q3329412', 'Q12104174', 'Q756102',
        'Q18704634', 'Q787934', 'Q4828724', 'Q10624527', 'Q2190251',
        // tomb
        'Q381885',
        // monument
        'Q4989906',
        // cemetry, grave
        'Q39614', 'Q200141', 'Q14750991',
        // monastery
        'Q44613',
        // zoo
        'Q43501',
        // building
        'Q1497364', 'Q3284499', 'Q41176', 'Q811430', 'Q7138926', 'Q1497375',
        'Q1021645',
        // arena
        'Q641226',
        // pier
        'Q863454',
        // roads
        'Q194029', 'Q34442', 'Q83620', 'Q7543083',
        // mansions, house
        'Q1802963', 'Q3947',
        // palace
        'Q16560', 'Q53536964',
        // hotel
        'Q27686',
        // hall
        'Q1763828', 'Q543654', 'Q1060829',
        // theater
        'Q24354', 'Q41253', 'Q742421', 'Q3469910', 'Q7362268',
        // park /garden
        'Q22698', 'Q194195', 'Q22746', 'Q1107656', 'Q272231',
        // temple ( mosque / church / cathedral / abbey)
        'Q842402', 'Q5393308', 'Q317557', 'Q16970', 'Q56242250', 'Q108325', 'Q427287',
        'Q32815', 'Q7405416', 'Q1454820', 'Q34627', 'Q56242225', 'Q44539', 'Q199451',
        'Q55876909', 'Q2977', 'Q160742', 'Q56242215', 'Q120560', 'Q15487029', 'Q2031836',
        'Q2680845', 'Q1566035', 'Q88291', 'Q54074585', 'Q3042249', 'Q2741017', 'Q48356', 'Q1088552',
        // architectural structure
        'Q811979',
        // geographic feature
        'Q618123',
        // geopark
        'Q1324355',
        // activity
        'Q1914636',
        // lighthouse
        'Q39715',
        // heritage
        'Q30634609', 'Q386426', 'Q210272',
        // dark sky preserve
        'Q3457162',
        // winery/vineyard
        'Q156362',
        // highland
        'Q878223',
        // natural region
        'Q1970725',
        // covention center
        'Q1378975',
        // concentration camp
        'Q153813',
        // coral reef
        'Q11292',
        // heritage site
        'Q38048753',
        // ski resort
        'Q130003',
        // lake
        'Q23397', 'Q9019918', 'Q4862338', 'Q188025',
        // oasis
        'Q43742',
        // tourist attraction
        'Q570116',
        // rift lake
        'Q6341928',
        // power station
        'Q15911738',
        // street
        'Q79007',
        // cave
        'Q35509', 'Q2232001',
        // fjord
        'Q45776',
        // opera
        'Q153562',
        // sculpture /  garden
        'Q1759852', 'Q860861', 'Q167346',
        // czech
        'Q5153359', 'Q15978299', 'Q7841907',
        // nomansland
        'Q312461',
        // wall/gates
        'Q82117',
        // atoll
        'Q11774746', 'Q42523',
        // boat, ship, submarine
        'Q11446', 'Q12859788',
        // body water
        'Q15324', 'Q131681',
        // cay/reef
        'Q503481', 'Q184358',
        // coast
        'Q93352',
        // canal
        'Q12284',
        // fort(ress)
        'Q1785071', 'Q386952', 'Q57831', 'Q57821',
        // sport, racing
        'Q18608583', 'Q3001412', 'Q1366722', 'Q483110', 'Q1777138', 'Q11822917',
        'Q1154710', 'Q1076486', 'Q476028',
        // crater lake
        'Q204324',
        // school, university, college research
        'Q3354859', 'Q3918', 'Q132834', 'Q62078547', 'Q31855',
        // strict nature reserve of Madagascar
        'Q20489120',
        'Q179049',
        // salt mine
        'Q40551',
        // biosphere reserve
        'Q158454',
        // prison
        'Q40357',
        // library
        'Q7075', 'Q22806', 'Q28564',
        // ruins
        'Q109607',
        // volcano
        'Q212057', 'Q8072',
        'Q169358',
        // desert
        'Q8514', 'Q319120',
        // valley
        'Q39816',
        // square
        'Q174782',
        // glacier/ice
        'Q35666', 'Q211302', 'Q878077',
        // shrine
        'Q845945',
        // forest
        'Q4421', 'Q9444',
        'Q144019',
        // canyon
        'Q150784',
        // pilgramage
        'Q15135589',
        // bend in river
        'Q17018380',
        'Q43197',
        // protected area
        'Q473972',
        // natural landscape
        'Q1286517',
        // arch site
        'Q839954',
        // waterfall
        'Q34038',
        // mountain
        'Q8502',
        'Q1437459',
        'Q133056',
        // swamp
        'Q166735',
        // plains
        'Q160091',
        // game reserve
        'Q1714375',
        // aquarium
        'Q2281788',
        // savanna
        'Q42320',
        // trail
        'Q628179',
        // railway station, airport, port
        'Q55488', 'Q44782', 'Q1248784', 'Q142031', 'Q283202', 'Q928830',
        'Q728937',
        // river
        'Q4022',
        // hiking
        'Q2143825',
        // hill station
        'Q2393184', 'Q54050',
        // sea
        'Q165',
        // battle, military
        'Q178561', 'Q245016', 'Q1930585',
        // bridge
        'Q14276458', 'Q158438', 'Q12042110', 'Q7814330', 'Q12280', 'Q1068842',
        'Q158555',
        // vegetation
        'Q2083910',
        // bay
        'Q39594',
        // beach
        'Q40080', 'Q18751767',
        // official residence
        'Q481289',
        // bazaar, market, mall, shopping
        'Q219760', 'Q330284', 'Q11315',
        // castle
        'Q1064905', 'Q23413', 'Q751876', 'Q92026', 'Q1044204', 'Q17715832',
        // reserve
        'Q20268453',
        // range
        'Q46831',
        // headland cape
        'Q191992', 'Q185113',
        // country side
        'Q175185',
        // courthouse
        'Q1137809',
        // ethnic people
        'Q41710',
        // flag
        'Q1971570',
        // private island
        'Q2984210'
    ].filter((key) => claims.includes(key)).length > 0
}

export function isInstanceOfLocation(claims) {
    return [
        // locality
        'Q35034452',
        // region
        'Q82794', 'Q57362',
        // town
        'Q3957', 'Q3744870', 'Q448801', 'Q13218690', 'Q317548',
        'Q4946461',
        // human settlement
        'Q486972', 'Q1962175',
        // council
        'Q719592',
        // department
        'Q6465',
        // area (e.g. metropolitan)
        'Q1907114', 'Q15979307', 'Q2755753',
        // other
        'Q5532181', 'Q3700011',
        'Q3685430', 'Q44753',
        // suburb quarter
        'Q188509', 'Q2983893', 'Q55116',
        // territory
        'Q9357527', 'Q3750285', 'Q15642541', 'Q1134686', 'Q37002670',
        'Q2225692', 'Q253019',
        // village
        'Q532', 'Q15630849', 'Q51049922',
        // neighborhood
        'Q19658107', 'Q6988120',
        // neth
        'Q2039348',
        // port city
        'Q2264924',
        // district
        'Q2292572', 'Q149621', 'Q379158', 'Q917092', 'Q1147395',
        'Q59136', 'Q1065118',
        // canton
        'Q1146429',
        // administrative
        'Q10864048', 'Q56061', 'Q835714',
        // chile
        'Q25412763',
        // border town
        'Q902814',
        // cadastral
        'Q20871353',
        // muncip
        'Q24764', 'Q856076', 'Q262166', 'Q755707', 'Q783930', 'Q70208',
        'Q6005581', 'Q640364', 'Q2074737',
        'Q3556889',
        // tunisia
        'Q41067667',
        // portugal
        'Q15647906',
        // sweden
        'Q127448',
        'Q12813115',
        // peninsular
        'Q34763',
        // provinces
        'Q24746', 'Q1075520', 'Q1615742', 'Q5098', 'Q15673297', 'Q134390',
        'Q83116',
        'Q1025116',
        // commune
        'Q3266850', 'Q1840161', 'Q484170', 'Q2989470', 'Q3327862',
        // district
        'Q2198484',
        'Q123705',
        // commune of benin
        'Q1780506',
        'Q6784672', 'Q620471', 'Q3257686', 'Q572784', 'Q493522',
        'Q2177636', 'Q56436498', 'Q3184121', 'Q3249005', 'Q162602',
        'Q7830262', 'Q1357964', 'Q1054813',
        'Q7930614', 'Q24698', 'Q15149663', 'Q35657',
        'Q28659128', 'Q1496967',
        'Q16858213', 'Q498162',
        'Q667509', 'Q747074', 'Q191093', 'Q180673', 'Q765865',
        'Q2989400', 'Q748149', 'Q59341087',
        'Q2577883', 'Q10742', 'Q216712', 'Q643589',
        'Q3191695', 'Q11828004', 'Q844713', 'Q1289426',
        'Q605291', 'Q13212489',
        'Q1758856', 'Q735428', 'Q1070990',
        'Q659103',
        'Q2590631',
        'Q2706302','Q104157',
        'Q15584664',
        // republic
        'Q41162',
        // county
        'Q192299',
        // state
        'Q7275', 'Q5852411', 'Q20617590', 'Q13390680', 'Q15063586',
        'Q3301455', 'Q28328984', 'Q2989398', 'Q261543',
    ].filter((key) => claims.includes(key)).length > 0;
}

export function isInstanceOfCity(claims ) {
    return [
        // city state e.g. Macau
        'Q14773', 'Q779415',
        // capital
        'Q5119',
        // metropopolis
        'Q200250',
        // city
        'Q5770918', 'Q3199141', 'Q56557504', 'Q1749269', 'Q494721',
        'Q22865', 'Q58339717', 'Q37800986', 'Q29045252', 'Q5123999',
        'Q515', 'Q12131640',
        'Q29946056',
        'Q1093829',
        'Q7930989',
        'Q1549591'
    ].filter((key) => claims.includes(key)).length > 0;
}

export function isInstanceOfNationalPark(claims ) {
    return [
        'Q728904', 'Q20626607', 'Q393259',
        'Q20537528', 'Q2006279', 'Q6974775',
        'Q20489083', 'Q18618843', 'Q11876497',
        'Q1896949', 'Q943017', 'Q1969240',
        'Q1317754',
        'Q20488347',
        'Q18618832',
        'Q18618819',
        'Q46169',
        'Q1132998',
        'Q34918903',
        // finland
        'Q14215551',
        // zambia
        'Q1408593',
        // national park of brazil
        'Q167946'
    ].filter((key) => claims.includes(key)).length > 0
}

export function isInstanceOfIsland(claims ) {
    return [
        // high island
        'Q1161185',
        // arciphelog
        'Q33837',
        'Q23442',
        // island group
        'Q1402592'
    ].filter((key) => claims.includes(key)).length > 0
}
