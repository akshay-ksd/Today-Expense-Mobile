import {View} from 'react-native'; 
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {SimpleRecycler} from 'react-native-simple-recyclerlistview';
import SingleUser from './orgnization/SingleUser';
import ScreenRatio from '../../components/constants/ScreenRatio';
import styles from './styles';
import usegetUserDetails from '../HomeScreen/api_hooks/getUserDetails/usegetUserDetails';
import {RefreshControl} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';
import colors from '../../components/constants/colors';
import Buttons from 'react-native-custom-buttons';

const UserList: FC = () => {
  const {getUserDetails} = usegetUserDetails();
  const [refreshing, setRefreshing] = useState(false);
  const recyclerRef = useRef<SimpleRecycler>(null);
  const [loading, setLoading] = useState(true);
  const pageData = useRef({
    currentPage: 0,
    totalPage: 0,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      let data: any = await getUserDetails(1);
      pageData.current = {
        currentPage: data?.page,
        totalPage: data?.per_page,
      };
      if (data) {
        setLoading(false);
        recyclerRef?.current?.loadDataFromApi(data?.data);
      }
    } finally {
      setLoading(false);
    }
  }, [getUserDetails]);

  useEffect(() => {
    loadData();
  }, []);

  const onEndReached = useCallback(async () => {
    if (pageData.current?.currentPage !== pageData?.current?.totalPage) {
      let data: any = await getUserDetails(pageData.current?.currentPage);
      pageData.current.currentPage = data?.page;
      if (data) {
        setLoading(false);
        recyclerRef?.current?.loadMoreData(data?.data);
        pageData.current.currentPage = pageData.current.currentPage += 1;
      }
    }
  }, [getUserDetails]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const rowRenderer = (
    _type: string | number,
    data: any,
    index: number,
    _extendedState?: object | undefined,
  ) => {
    return <SingleUser index={index} item={data?.item} />;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size={20} color={colors.black} />
        </View>
      ) : (
        <SimpleRecycler
          ref={recyclerRef}
          rowRenderer={rowRenderer}
          height={ScreenRatio.height}
          width={ScreenRatio.width}
          emptyText="No Data Found"
          emptyTextStyle={styles.emptyText}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ),
          }}
          renderFooter={() => (
            <View>
              <Buttons
                type="Text"
                onPress={onEndReached}
                title="Load More Data"
              />
              <View style={styles.footer} />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default UserList;
