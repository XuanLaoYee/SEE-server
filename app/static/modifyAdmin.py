#修改管理员
from docx import Document 
import sys  
title=sys.argv[1]
adminName=sys.argv[2]

document = Document(title+'.docx')
paragraphs=document.paragraphs
#print(paragraphs[2])
#para=paragraphs[2]#得到admin：
paragraphs[2].text="admin:"+adminName
#print(paragraphs[2])
document.save(title+'.docx')