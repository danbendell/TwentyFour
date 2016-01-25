module.exports = function(router)
{
    router.get('/api/cards', function (req, res)
    {
        res.sendFile('deck.json', {"root": __dirname});
    });

    router.get('/api/combinations', function (req, res)
    {
        res.sendFile('combinations.json', {"root": __dirname});
    });

    router.get('*', function(req, res)
    {
        res.sendFile('/public/index.html', {"root": __dirname});
    });
};