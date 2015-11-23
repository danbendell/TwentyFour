module.exports = function(router)
{
    router.get('/api/cards', function (req, res)
    {
        console.log('getting cards');
        res.sendFile('deck.json', {"root": __dirname});
    });

    router.get('*', function(req, res)
    {
        res.sendFile('/public/index.html', {"root": __dirname});
    });
};