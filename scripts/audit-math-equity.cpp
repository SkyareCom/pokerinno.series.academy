#include <algorithm>
#include <cstdlib>
#include <array>
#include <iostream>
#include <vector>
#include <iomanip>
using namespace std;
int straight(int mask){for(int h=12;h>=4;--h)if((mask&(31<<(h-4)))==(31<<(h-4)))return h+2;return (mask&4111)==4111?5:0;}
int pack(int cat,vector<int> v){int n=cat;for(int i=0;i<5;i++)n=n*15+(i<(int)v.size()?v[i]:0);return n;}
template<size_t N> int rank7(const array<int,N>& a){int c[13]={},s[4]={},mask=0,sm[4]={};for(int x:a){c[x/4]++;s[x%4]++;mask|=1<<(x/4);sm[x%4]|=1<<(x/4);}int fl=-1;for(int i=0;i<4;i++)if(s[i]>=5)fl=i; if(fl>=0){int st=straight(sm[fl]);if(st)return pack(8,{st});}vector<int> pairs,trip,quad;for(int r=12;r>=0;r--){if(c[r]==4)quad.push_back(r+2);if(c[r]==3)trip.push_back(r+2);if(c[r]>=2)pairs.push_back(r+2);}auto kick=[&](vector<int> skip,int n){vector<int> v;for(int r=12;r>=0;r--)if(c[r]&&find(skip.begin(),skip.end(),r+2)==skip.end()){v.push_back(r+2);if((int)v.size()==n)break;}return v;};if(!quad.empty())return pack(7,{quad[0],kick({quad[0]},1)[0]});if(!trip.empty()){for(int p:pairs)if(p!=trip[0])return pack(6,{trip[0],p});}if(fl>=0){vector<int> v;for(int r=12;r>=0;r--)if(sm[fl]&(1<<r)){v.push_back(r+2);if(v.size()==5)break;}return pack(5,v);}int st=straight(mask);if(st)return pack(4,{st});if(!trip.empty()){auto v=kick({trip[0]},2);v.insert(v.begin(),trip[0]);return pack(3,v);}if(pairs.size()>=2)return pack(2,{pairs[0],pairs[1],kick({pairs[0],pairs[1]},1)[0]});if(pairs.size()==1){auto v=kick({pairs[0]},3);v.insert(v.begin(),pairs[0]);return pack(1,v);}return pack(0,kick({},5));}
int card(string c){string ranks="23456789TJQKA",suits="shdc";return (int)ranks.find(c[0])*4+(int)suits.find(c[1]);}
void selfTest(){
  long long counts[9]={};
  for(int a=0;a<48;a++)for(int b=a+1;b<49;b++)for(int c=b+1;c<50;c++)for(int d=c+1;d<51;d++)for(int e=d+1;e<52;e++)counts[rank7(array<int,5>{a,b,c,d,e})/759375]++;
  long long expected[9]={1302540,1098240,123552,54912,10200,5108,3744,624,40};
  for(int i=0;i<9;i++)if(counts[i]!=expected[i]){cerr<<"Five-card frequency mismatch "<<i<<endl;exit(1);}
  unsigned int seed=219819; auto rnd=[&](){seed=1664525*seed+1013904223;return seed;};
  for(int k=0;k<10000;k++){array<int,7>a{};for(int i=0;i<7;i++){bool duplicate;do{a[i]=rnd()%52;duplicate=false;for(int j=0;j<i;j++)duplicate|=a[i]==a[j];}while(duplicate);}int best=0;for(int i=0;i<6;i++)for(int j=i+1;j<7;j++){array<int,5>b{};int p=0;for(int q=0;q<7;q++)if(q!=i&&q!=j)b[p++]=a[q];best=max(best,rank7(b));}if(rank7(a)!=best){cerr<<"Seven-card ranking mismatch"<<endl;exit(1);}}
  cerr<<"Verified all 2,598,960 five-card hands and 10,000 seven-card hands"<<endl;
}
int main(){selfTest();vector<vector<string>> rows={{"aa-kk","As","Ah","Kc","Kd"},{"aa-ako","As","Ah","Ad","Kc"},{"aa-aks","As","Ah","Ad","Kd"},{"88-aqo","8s","8h","Ad","Qc"},{"88-aqs","8s","8h","Ad","Qd"},{"qq-ako","Qs","Qh","Ad","Kc"},{"qq-aks","Qs","Qh","Ad","Kd"},{"ako-aqo","As","Kh","Ad","Qc"}};for(auto row:rows){array<int,7> h{},v{};h[0]=card(row[1]);h[1]=card(row[2]);v[0]=card(row[3]);v[1]=card(row[4]);vector<int>d;for(int x=0;x<52;x++)if(x!=h[0]&&x!=h[1]&&x!=v[0]&&x!=v[1])d.push_back(x);long long w=0,t=0,n=0;for(int a=0;a<44;a++)for(int b=a+1;b<45;b++)for(int c=b+1;c<46;c++)for(int e=c+1;e<47;e++)for(int f=e+1;f<48;f++){h[2]=v[2]=d[a];h[3]=v[3]=d[b];h[4]=v[4]=d[c];h[5]=v[5]=d[e];h[6]=v[6]=d[f];int hr=rank7(h),vr=rank7(v);w+=hr>vr;t+=hr==vr;n++;}cout<<row[0]<<" "<<row[1]<<" "<<row[2]<<" "<<row[3]<<" "<<row[4]<<" "<<w<<" "<<t<<" "<<n<<endl;}}
