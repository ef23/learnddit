# Learnddit
## Zack Brody (ztb5), Eric Feng (evf23), Michelle Ip (mvi4), Monica Ong (myo3), Jill Wu (jw975)

Deployed at https://learnddit-v3.herokuapp.com. If the link or app does not work, that is probably because our Google Cloud Platform trial expired as we store Reddit comments from the past several years on it (Heroku had a 10k limit but we need to store around ~300k comments). 

## Introduction

This project was done for Cornell's [CS4300](http://www.cs.cornell.edu/courses/cs4300/2018sp/), a course on information retrieval. Learnddit is an app that searches through [/r/IWantToLearn](https://reddit.com/r/IWantToLearn) to retrieve relevant comments related to the search query. This is different from a regular Reddit search as it only does a boolean search on post titles, but not comments and without regard for weighting. We use a combination of cosine-similarity with tf-idf scoring, alongside weighing certain search terms heavier utilizing NLTK to classify more important query terms.

## Technologies 
* Flask
* ReactJS
* NLTK
