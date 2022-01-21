  const WebSocket = require('ws'),
  fs = require('fs');

  const config = JSON.parse(fs.readFileSync('./config.json', {encoding:'utf8'})); 
  
  if (!config.prefix.startsWith('/')) {
      config.prefix = `/${config.prefix}`; 
  }

  if (!config.prefix.endsWith('/')) {
     config.prefix = `${config.prefix}/`;
  }

  btoa = (str) => {
  
      str = new Buffer.from(str).toString('base64');
      return str;
      
  };
  

  
  atob = (str) => {
  
    str = new Buffer.from(str, 'base64').toString('utf-8');
    
    return str;
    
  };

  module.exports = (server) => {
  
  const wss = new WebSocket.Server({ server: server });

  wss.on('connection', (cli, req) => {

    //try {
      const svr = new WebSocket(atob(req.url.toString().replace(`${config.prefix}ws/`, '').split('?origin=')[0]), {
        origin: req.url.split('?origin=')[1]
      });

      svr.on('open', () => {

        console.log('proxy opened')

        //try { cli.send(data) } catch(err){}
        cli.on('message', (data) => {

          svr.send(data.toString())
    
        });

        svr.on('message', (data) => {

          cli.send(data)
    
        });        

        cli.on('close', (code) => {

          svr.close()//try { svr.close(code); } catch(err) { svr.close(1006)  };

        });

        svr.on('close', (code) => {

          cli.close()//try { cli.close(code); } catch(err) { cli.close(1006)  };

        });

        cli.on('error', (err) => {

          svr.terminate()//try { svr.close(1001); } catch(err) { svr.close(1006) };

        });

        svr.on('error', (err) => {

          cli.terminate()//try { cli.close(1001); } catch(err) { cli.close(1006) };

        });

      });

      /*svr.on('open', () => {
    
        cli.on('message', (data) => {

          svr.send(data)
    
        });

      });*/
 

      cli.on('close', (code) => {

        try { svr.close(code); } catch(err) { svr.close(1006)  };

      });

      svr.on('close', (code) => {

        try { cli.close(code); } catch(err) { cli.close(1006)  };

      });

      cli.on('error', (err) => {

        try { svr.close(1001); } catch(err) { svr.close(1006) };

      });

      svr.on('error', (err) => {

        try { cli.close(1001); } catch(err) { cli.close(1006) };

      });
  
    //} catch(err) { console.log(err);cli.close(1001); }
  });
 }
