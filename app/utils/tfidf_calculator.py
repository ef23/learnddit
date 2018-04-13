import json
import math
import string
import time
import os
import sys
import enchant
import pickle
import nltk
import re
from nltk.corpus import stopwords
from nltk.tokenize import TreebankWordTokenizer

def compute_idf(inv_idx, n_docs, min_df=10, max_df_ratio=0.95):
   '''
   Computes the idfs of all the terms

    pls return a dict and save it in a pkl file

   :param inv_idx: Not actually needed, just read the files from app/utils/data
   :param n_docs: Not actually needed, just read the n_docs file from app/utils/data
   '''
  None

def compute_doc_norms():
  '''
   Computes the doc_norms of all the documents

   built it into a dict and save it as a pkl file
   '''

  f = open("idf.pkl","rb")
  idf = pickle.load(f)

  path = sys.argv[1]

  print "starting to calculate doc norms of words..."
  start_time = int(time.time())

  tokenizer = TreebankWordTokenizer()
  stop_words = set(stopwords.words('english'))
  d = enchant.Dict("en_US")

  # f = open("words_v2.pkl","rb")
  # words = pickle.load(f);

  # f = open("filenames_doc_norms.pkl","rb")
  # files = pickle.load(f)

  # words = set([])
  files = set([])

  doc_norms = {}

  numbers = re.compile("^[0-9]{1,45}$")

  for filename in os.listdir(os.getcwd() + "/" + path):
    if "json" not in filename:
      continue

    if filename in files:
      print filename, "already processed!"
      continue

    files.add(filename)
    filename = path + "/" + filename
    with open(filename, "r") as file:
      print "starting", filename
      counter = 0
      for line in file:
        objs = json.loads(line)
        count = len(objs)

        # iterate through all the comments of this
        for obj in objs:
          # remove automoderator comments
          if obj["author"].ncode("utf-8").lower() is "automoderator":
            continue

          comment_id = obj["id"]
          norm_sum = 0;
          body = obj["body"].encode("utf-8")

          # bye bye punctuation
          body = body.lower().translate(None, string.punctuation)

          # tokenize comments
          for word in tokenizer.tokenize(body):
            # remove stop words and links
            if word in stop_words or "http" in word or "www" in word or not word:
              continue
            if numbers.match(word):
              continue
            # place into inverted index
            if word in words:
              # load word pkl file
              f = open(saved_path + word + ".pkl","r+b")
              word_dict = pickle.load(f)

              # calculate tf-idf
              doc_tf = word_dict[comment_id]
              doc_idf = idf[comment_id]
              norm_sum += (doc_tf * doc_idf)**2
          doc_norms[comment_id] = math.sqrt(norm_sum)
          counter+=1

          # print counter
          if counter % 3000 == 0:
            print "", float(counter)/count, "%\r"
    print "completed", filename
  end_time = int(time.time())
  print "finished in", (end_time-start_time)

  f = open("doc_norms.pkl","wb")
  pickle.dump(doc_norms,f)
  f.close()

  f = open("filenames_doc_norms.pkl","wb")
  pickle.dump(files,f)
  f.close()

compute_idf()
compute_doc_norms()

