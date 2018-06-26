

window.all_products = [
    { productID: 15, enabled: true, category: 'rng', type: 'keno', index_range: { min: 5, max: 600 }, url: 'http://keno.garcade.net/kenoGarcade/max_keno.aspx' },
    { productID: 16, enabled: true, category: 'rng', type: 'keno', index_range: { min: 5, max: 600 }, url: 'http://keno.garcade.net/kenoGarcade/max2_keno.aspx' },
    { productID: 17, enabled: true, category: 'mini-keno', type: 'mini-keno', index_range: { min: 5, max: 150 }, url: 'http://keno.garcade.net/kenoGarcade/mini_keno.aspx' },
    { productID: 24, enabled: true, category: 'mini-keno', type: 'mini-keno', index_range: { min: 5, max: 150 }, url: 'http://keno.garcade.net/kenoGarcade/mini2_keno.aspx' },
    { productID: 19, enabled: true, category: 'rng', type: 'keno', index_range: { min: 5, max: 600 }, url: 'http://keno.garcade.net/kenoGarcade/season_spring.aspx' },
    { productID: 20, enabled: true, category: 'rng', type: 'keno', index_range: { min: 5, max: 600 }, url: 'http://keno.garcade.net/kenoGarcade/season_Summer.aspx' },
    { productID: 21, enabled: true, category: 'rng', type: 'keno', index_range: { min: 5, max: 600 }, url: 'http://keno.garcade.net/kenoGarcade/season_autumn.aspx' },
    { productID: 22, enabled: true, category: 'rng', type: 'keno', index_range: { min: 5, max: 600 }, url: 'http://keno.garcade.net/kenoGarcade/season_winter.aspx' },
    { productID: 23, enabled: false, category: 'country', type: 'keno', index_range: { min: 5, max: 600 }, url: 'http://keno.garcade.net/' },
    { productID: 3, enabled: true, category: 'country', type: 'keno', index_range: { min: 5, max: 600 }, url: 'https://eklubkeno.etipos.sk/Archive.aspx' },
    { productID: 4, enabled: true, category: 'country', type: 'keno', index_range: { min: 5, max: 600 }, url: 'http://lotto.bclc.com/winning-numbers/keno-and-keno-bonus.html' },
    { productID: 5, enabled: true, category: 'country', type: 'keno', index_range: { min: 5, max: 600 }, url: 'http://www.wclc.com/winning-numbers/keno.htm' },
    { productID: 8, enabled: true, category: 'country', type: 'keno', index_range: { min: 5, max: 600 }, url: 'http://www.ohiolottery.com/WinningNumbers/KenoDrawings/KenoDrawingsArchive.aspx' },
    { productID: 11, enabled: false, category: 'country', type: 'keno', index_range: { min: 5, max: 600 }, url: 'http://www.kylottery.com/apps/draw_games/keno/keno_pastwinning.html' },
    { productID: 13, enabled: false, category: 'country', type: 'keno', index_range: { min: 5, max: 600 }, url: 'https://www.michiganlottery.com/club_keno_info' }
];


window.apiUrl = 'http://test.com/data/';
window.placeBetUrl = 'customer.json?k=placeTicket&rds=' + GetURLParameter('rd');
window.customerUrl = 'customer.json?k=info&rds=' + GetURLParameter('rd');
window.customerBalanceUrl = 'customer-balance.json?rds=' + GetURLParameter('rd');
window.drawsCheckUpdateUrl = 'draws.json'; // data de ve cac bang
window.singleResultUrl = 'single-result.json';
window.nextDrawsUrl = 'next-draw.json';
window.beforeBetUrl = 'customer-balance.json?k=bf_place&rds=' + GetURLParameter('rd');
window.roadmapUrl = 'roadmap.json';
window.custBetUrl = 'betlist.json';
window.annUrl = 'ann.aspx';
window.forceLogoutUrl = 'abc?ct=' + GetURLParameter('ct');
window.betListUrl = 'SUB/open_bet.aspx?rd=' + GetURLParameter('rd') + '&ct=' + GetURLParameter('ct');
window.statementUrl = 'SUB/dailyStatement.aspx?rd=' + GetURLParameter('rd') + '&ct=' + GetURLParameter('ct');
window.resultUrl = 'SUB/result_list.aspx?t=0&ct=' + GetURLParameter('ct');
window.howToPlayUrl = 'SUB/rules.aspx?ct=' + GetURLParameter('ct');
window.openWindowSize = [800, 600];