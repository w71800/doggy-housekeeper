require("dotenv").config()
const { Client } = require("@notionhq/client")
const notion = new Client({ auth: process.env.NOTION_SECRET });



const getRow = async () => {
  return await notion.databases.query({ database_id: process.env.NOTION_ID });
  
  // 取得的方法是 results.properties.屬性
  // pages.results[0].properties.previous.rich_text[0].plain_text
  // pages.results[0].properties.result.rich_text[0].plain_text
}

const setRow = async (data) => {
  try {
    let schema = {
      parent: { database_id: process.env.NOTION_ID },
      properties: {
        title: {
          title: [
            {
              text: {
                content: "更新紀錄"
              }
            }
          ]
        },
        previous: {
          rich_text: [
            {
              text: {
                content: JSON.stringify(data.previous)
              }
            }
          ]
        },
        result: {
          rich_text: [
            {
              text: {
                content: JSON.stringify(data.routines)
              }
            }
          ]
        }
      }
    }

    return await notion.pages.create(schema)

  } catch(e) {
    console.log(e);
  }
}

module.exports = { getRow, setRow }

