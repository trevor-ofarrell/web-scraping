#!/usr/bin/python3
import lxml.html
import requests
from bs4 import BeautifulSoup, NavigableString
import csv
import json
from unicodedata import normalize

html = requests.get('https://ratings.fide.com/top.phtml?list=men').text
soup = BeautifulSoup(html, 'lxml')
names = soup.findAll('a', {'class': 'tur'})

def top100():
    player_ranks_and_stats = []
    player_rankings = []
    item_str = ""
    count = 0
    print(names[0].text)
    for name in names:
        player_rankings.append(name.text)
        for items in name.find_all_next('td'):
            for item in items:
                count += 1
                if count > 805:
                    break
                if isinstance(item.string, NavigableString) is True:
                    item_str = normalize('NFKD', item.string)
                player_ranks_and_stats.append(item_str)
                print(item.string)

    player_rankings = enumerate(player_rankings, 1)

    with open('top_100_chessplayers.csv', 'w') as fp:
        csv_writer = csv.writer(fp)
        for player in player_rankings:
            csv_writer.writerow([player])

    with open('top_100_chessplayers_full_information.csv', 'w') as fp:
        csv_writer = csv.writer(fp)
        csv_writer.writerow([names[0].text])
        for row in player_ranks_and_stats:
            csv_writer.writerow([row])

print("-------------------------------------------------------------")
print(top100())
print("-------------------------------------------------------------")
print("\n")
print("results saved to CSV files")
print("\n")
print("-------------------------------------------------------------")
