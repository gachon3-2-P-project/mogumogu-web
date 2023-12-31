import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import Category from '../../../components/AdminCategory/Category';

import Pagination from 'react-js-pagination';


const itemsPerPage = 5;

export default function AdminTransaction() {
    const [posts, setPosts] = useState([]); // 게시글 상태
    const [currentPage, setCurrentPage] = useState(1);


    const [approvalStatus, setApprovalStatus] = useState({});

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(posts.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    //거래 승인
    const handleApproval = async (articleId) => {
        try {


            const response = await axios.patch(`http://dana-seo.shop:8080/api/article/admin/approve?articleId=${articleId}`);
            const updatedPost = response.data;

            setPosts(prevPosts => {
                const index = prevPosts.findIndex(post => post.id === updatedPost.id);
                const newPosts = [...prevPosts];
                newPosts[index] = updatedPost;

                return newPosts;
            });

            setApprovalStatus((prevStatus) => ({
                ...prevStatus,
                [articleId]: true,
            }));

            alert('관리자가 거래를 승인하였습니다');

            const updatedResponse = await axios.get('http://dana-seo.shop:8080/api/article/getAll');
            setPosts(updatedResponse.data);
        } catch (error) {
            console.error('Error approving transaction:', error);
            alert('거래 승인 중 에러가 발생했습니다.');
        }
    };

    //최종 거래 완료
    const handleCompletion = async (articleId) => {
        try {

           
            // 최종 거래 완료 요청
            const response = await axios.patch(`http://dana-seo.shop:8080/api/article/admin/final?articleId=${articleId}`);

            const updatedPost = response.data;
            alert('관리자가 최종 거래를 승인하였습니다');
            // alert 이후에 상태 업데이트
            setApprovalStatus((prevStatus) => ({
                ...prevStatus,
                [articleId]: false,
            }));

            setTimeout(() => {
                setPosts((prevPosts) => {
                    const index = prevPosts.findIndex((post) => post.id === updatedPost.id);
                    const newPosts = [...prevPosts];
                    newPosts[index] = updatedPost;
                    return newPosts;
                });
            }, 0);
            const updatedResponse = await axios.get('http://dana-seo.shop:8080/api/article/getAll');
            setPosts(updatedResponse.data);

        } catch (error) {
            console.error('Error completing transaction:', error);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://dana-seo.shop:8080/api/article/getAll');
                setPosts(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();
    }, []);


    return (
        <div>
            <Category />
            <TitleBox>
                <BoardTitle>번호</BoardTitle>
                <Title>제목</Title>
                <Situation>현황</Situation>
            </TitleBox>
            {currentPosts.map((post) => (
                <BoardItem key={post.id}>
                    <Number>{post.id}</Number>
                    <PostTitle>{post.title}</PostTitle>
                    <PostSituation>
                        {post.transactionStatus === 'RECRUITOPEN' && '모집중'}
                        {post.transactionStatus === 'RECRUITCLOSED' && '모집마감'}
                        {post.transactionStatus === 'APPROVED' && '거래 승인'}
                        {post.transactionStatus === 'COMPLETED' && '거래 완료'}
                        {post.transactionStatus === 'FINAL' && '거래최종완료'}
                    </PostSituation>
                    <div style={{ marginLeft: '8vw' }}>
                        <Button onClick={() => handleApproval(post.id)}>거래 승인</Button>
                        <Button onClick={() => handleCompletion(post.id)}>최종 완료</Button>
                    </div>
                </BoardItem>
            ))}
            {totalPages > 1 && (
                <PaginationContainer>
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={itemsPerPage}
                        totalItemsCount={posts.length}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                    />
                </PaginationContainer>
            )}
        </div>
    );
}

const TitleBox = styled.div`
    display: flex;
    flex-direction: row;
    width: 90%;
    height: 100%;
    flex-shrink: 0;
    margin: 3rem 3rem 3rem 3.5rem;
`;




const BoardItem = styled.div`
    display: flex;
    flex-direction: row;
    width: 90%;
    height: 3rem;
    flex-shrink: 0;
    margin: 0rem 3rem 0rem 3.5rem;
    padding: 1rem;
    gap: 1rem;
    border-top: 1px solid rgba(204, 204, 204, 0.80);
    border-bottom: 1px solid rgba(204, 204, 204, 0.80); 
    background: #F3F3F3;
`;

//====================게시글 타이틀 Css=========================

const BoardTitle = styled.div`
    color: #000;
    font-family: Noto Sans;
    font-size: 1.5vw;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 4px;
    width: 5%;
`;


const Situation = styled(BoardTitle)`
    margin-left: 9vw;
    width: 10%; 
`;


const Title = styled(BoardTitle)`
    margin-left: 25vw;
    width: 20%; 
`;

// ======================게시글 안 Css==========================
const Number = styled.div`
    color: #000;
    font-family: Noto Sans;
    font-size: 1.5vw;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.3vw;
    width: 5%; 
`;


const PostTitle = styled(Number)`
     margin-left: 15vw;
    width: 30%; 
`;


const PostSituation = styled(Number)`
    margin-left: 6vw;
    width: 20%; 
`;
//==============================================================

//페이징Css
const PaginationContainer = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
`;

const Button = styled.button`
    width: 7vw;
    height: 2vw;
    flex-shrink: 0;
    border-radius: 2vw;
    background: #FFF;
    color: #000;
    font-family: Noto Sans;
    font-size: 1.0vw;
    font-style: normal;
    font-weight: bold;
    line-height: normal;
    border: none;
    cursor: pointer;
`;


