const {electron, app, BrowserWindow, ipcMain, dialog,} = require("electron"),
    Store = require('electron-store'),
    path = require("path");
    request = require('request-promise');

//Call of json which stock the data
const store = new Store();

store.clear();

let characters = store.get('characters');

//If there are no data in the json file, we create default data
if (!characters || characters.length === 0) {
    characters = [];

    let options = {
        uri: 'https://api.genshin.dev/characters',
        json: true
    };

    request(options)
        .then(function (data) {
            data.forEach(name => {
                options.uri = `https://api.genshin.dev/characters/${name}`;
                request(options)
                    .then(function (data) {
                        characters.push(data);
                        console.log(data);
                    });
            });
        });

    //Save of data in the json file
    store.set('characters', characters);
}

//We keep the windows in variables
let mainWindow;

//The function which create windows
const createWindows = (viewName, data) => {
    const win = new BrowserWindow({
        webPreferences: {
            fullscreen: true,
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "preload.js")
        }
    });

    //Display of the view
    win.loadFile(path.join(__dirname, "views", viewName, viewName + ".html"));


    //If there is no data to send to the view in parameter, we don't do this
    if (data) {
        win.webContents.on('did-finish-load', () => {
            win.webContents.send('init-data', data);
        });
    }

    return win;
};

//Create the window Home when the app is ready to start
app.whenReady().then(() => {
    mainWindow = createWindows("home", characters);
});

//For Windows/Mac compatibility
app.on("window-all-closed", () => {
    if (process.platform != "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length == 0) {
        mainWindow = createWindows("home", characters);
    }
});


