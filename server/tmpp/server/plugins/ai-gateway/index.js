export default (props) => {
    // console.log("GPTGateway",props);

    // _.forEach()
  if (props && props.entity)
    props.entity.map((item, i) => {
      if (item.name === 'gateway')
        if (item.routes)
          item.routes.push({
            'path': '/ai/chat/',
            'method': 'get',
            'access': 'customer_all',
            'controller': (req, res, next) => {
              console.log('req', req.query);
              let verify={}
              req.httpRequest({
                method: "get",
                url: encodeURI("https://idehweb.com/pedrak?q="+req.query.q),
                // data: {text: req.body.text,username: req.body.username || ''},
                json: true
              }).then(function(parsedBody) {
                if (!parsedBody['data']) {
                  return res.json({
                    'success': false,
                    'message': '',
                  });
                }
                return res.json(parsedBody['data'])


              }).catch(e => res.json({ e, requ: verify }));
            }
          })
      // }

    });
  // props['plugin']['ai-gateway'] = [
  //   { name: 'merchant', value: '', label: 'merchant code' },
  // ];




  return props;
}
