#include <bits/stdc++.h>
using namespace std;

int main() {

  int N;
  cin>>N;
  int ele;
  int arr[N];
  int i=1;
  int j=N;
  int k=N;
  int ans[N];
  
  for(int i=1;i<=N;i++)
  {
    cin>>ele;
    arr[i]=ele;
  }
  
  while(i<=j)
  {
    if(abs(arr[j])>=abs(arr[i]))
    {
      ans[k]=arr[j]*arr[j];
      j--;
     // k--;
    }
    else
    {
      ans[k]=arr[i]*arr[i];
      i++;
      //k--;
    }
    k--;
  }
  for(int i=1;i<=N;i++)
  {
    cout<<ans[i]<<" ";
  }
  

}