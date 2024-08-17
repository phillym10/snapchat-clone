
import path from 'path'
import fs from 'fs'

type TrueorFalse = true | false

export class JsonDb {
    private dbfolder: string;
    private filename: string;

    public constructor (dbfolder: string, dbname: string) {
        this.dbfolder = dbfolder
        this.filename = path.join(dbfolder, `${dbname}.json`)
        this.createDbFile()
    }

    private createDbFile() {
        if (fs.existsSync(this.filename)) return
        if (!fs.existsSync(this.dbfolder)) {
            fs.mkdirSync(this.dbfolder)
            fs.writeFileSync(`${this.filename}`, "[]", 'utf8')
        } else {
            fs.writeFileSync(`${this.filename}`, "[]", 'utf8')
        }
    }

    private async findwithindex (filter: { [key: string]: any }, callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db = JSON.parse(filecontents)
        
        const foundIndexes: any[] = []
        for (let i = 0; i < db.length; i++) {
            const row: { [key: string]: any } = db[i];
            let found: boolean = false
            for (let key in row) {
                if (filter[key] == undefined) continue
                if (row[key] == filter[key]) found = true; else {
                    found = false
                    break
                }
            }
            if (found) foundIndexes.push(i)
        }
        
        if (foundIndexes.length < 1) callback([], [], false); else {
            callback(db, foundIndexes, false)
        }
    }

    public async find (filter: { [key: string]: any }, callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db = JSON.parse(filecontents)
        if (Object.keys(filter).length < 1) {
            callback(db, false)
            return
        }
        
        const foundIndexes: any[] = []
        for (let i = 0; i < db.length; i++) {
            const row: { [key: string]: any } = db[i];
            let found: boolean = false
            for (let key in row) {
                if (filter[key] == undefined) continue
                if (row[key] == filter[key]) found = true; else {
                    found = false
                    break
                }
            }
            if (found) foundIndexes.push(i)
        }
        
        if (foundIndexes.length < 1) callback([], false); else {
            const result: any = []
            foundIndexes.forEach((value) => result.push(db[value]))
            callback(result, false)
        }
    }

    private async findOnewithindex (filter: { [key: string]: any }, callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db = JSON.parse(filecontents)
        
        let foundIndex = null
        for (let i = 0; i < db.length; i++) {
            const row: { [key: string]: any } = db[i];
            let found: boolean = false
            for (let key in row) {
                if (row[key] == filter[key]) {
                    found = true;
                    break 
                } else found = false
            }
            if (found) foundIndex = i
        }
        
        if (foundIndex == null || foundIndex == undefined) callback(undefined, foundIndex, false); else callback(db[foundIndex], foundIndex, false)
    }

    public async findOne (filter: { [key: string]: any }, callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db = JSON.parse(filecontents)
        
        let foundIndex = null
        for (let i = 0; i < db.length; i++) {
            const row: { [key: string]: any } = db[i];
            let found: boolean = false
            for (let key in row) {
                if (filter[key] == undefined) continue
                if (row[key] == filter[key]) found = true; else {
                    found = false
                    break
                }
            }
            if (found) foundIndex = i
        }
        
        if (foundIndex == null || foundIndex == undefined) callback(undefined, true); else callback(db[foundIndex], false)
    }

    public async search (filter: { [key: string]: any }, callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db = JSON.parse(filecontents)
        if (Object.keys(filter).length < 1) {
            callback(db, false)
            return
        }
        
        const foundIndexes: any[] = []
        for (let i = 0; i < db.length; i++) {
            const row: { [key: string]: any } = db[i];
            let found: boolean = false
            for (let key in row) {
                if (filter[key] == undefined) continue
                if (row[key].includes(filter[key])) found = true; else {
                    found = false
                    break
                }
            }
            if (found) foundIndexes.push(i)
        }
        
        if (foundIndexes.length < 1) callback([], false); else {
            const result: any = []
            foundIndexes.forEach((value) => result.push(db[value]))
            callback(result, false)
        }
    }
    
    public async insert (newitem: object, callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db: any[] = JSON.parse(filecontents)
        const currentlength: number = db.length
        if (db.push(newitem) > currentlength){
            fs.writeFileSync(this.filename, JSON.stringify(db), 'utf8')
            callback(true, false);
        } else callback(undefined, true)
    }

    public async update (finditem: object, setitem: { [key: string]: any }, multi: TrueorFalse = false,  callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db: any[] = JSON.parse(filecontents)

        if (multi === false) {
            this.findOnewithindex(finditem, (data: any, updatingindex: any, error: any) => {
                if (!error) {
                    if (data == undefined) callback(undefined, true); else {
                        let newUpdate = data
                        for (let key in data) {
                            if (setitem[key] == undefined) continue
                            newUpdate[key] = setitem[key]
                        }
                        db[updatingindex] = newUpdate

                        fs.writeFileSync(this.filename, JSON.stringify(db), 'utf8')
                        callback("updated", false)
                    }
                } else callback(undefined, true)
            })
        } else {
            this.findwithindex(finditem, (data: any[], indexes: any[], error: any) => {
                if (!error) {
                    if (data == undefined) callback(undefined, true); else if (indexes.length < 1) {
                        callback(undefined, false)
                    } else {
                        for (let i = 0; i < indexes.length; i++) {
                            const updatingindex = indexes[i]
                            let newUpdate = data[updatingindex]
                            
                            for (let key in newUpdate) {
                                if (setitem[key] == undefined) continue
                                newUpdate[key] = setitem[key]
                                db[updatingindex] = newUpdate
                            }
                        }

                        fs.writeFileSync(this.filename, JSON.stringify(db), 'utf8')
                        callback("updated", false)
                    }
                } else callback(undefined, true)
            })
        }
    }

    public async delete(filter: { [key: string]: any }, callback: Function) {
        const filecontents = fs.readFileSync(this.filename, 'utf8')
        const db: any[] = JSON.parse(filecontents)

        const foundIndexes: any[] = []
        for (let i = 0; i < db.length; i++) {
            const row: { [key: string]: any } = db[i];
            let found: boolean = false
            for (let key in row) {
                if (filter[key] == undefined) break
                if (row[key] == filter[key]) found = true; else {
                    found = false
                    break
                }
            }
            if (found) foundIndexes.push(i)
        }
        
        const result: any[] = []
        db.forEach((value, index) => { if (!foundIndexes.includes(index)) result.push(value) })
        fs.writeFileSync(this.filename, JSON.stringify(result), 'utf8')
        callback("deleted", false)
    }
}