import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import './Pagination.css';
import Pagination from 'react-js-pagination';




const Paging = () => {
  const navigate = useNavigate();

  const [note, setNote] = useState([]);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = note.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(note.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNoteClick = (post) => {
    setNote(post);
  };

  useEffect(() => {
    const userIdFromLocalStorage = localStorage.getItem('userId');
  
    if (!userIdFromLocalStorage) {
      console.error('UserId not found in local storage');
      return;
    }
  
    const fetchUserArticles = async () => {
      try {
        const response = await axios.get(`http://dana-seo.shop:8080/api/message/getMessageStorage?userId=${userIdFromLocalStorage}`);
        const articles = response.data;
  
        // 중복된 articleTitle을 제거한 배열 생성
        const uniqueArticles = [];
        const uniqueTitlesSet = new Set();
  
        articles.forEach(article => {
          if (!uniqueTitlesSet.has(article.articleTitle)) {
            uniqueTitlesSet.add(article.articleTitle);
            uniqueArticles.push({
              articleTitle: article.articleTitle,
              articleId: article.articleId
            });
          }
        });
  
        setNote(uniqueArticles);
        console.log(uniqueArticles);
      } catch (error) {
        console.error('Error fetching user articles:', error);
      }
    };
  
    fetchUserArticles();
  }, []);
    
  


  return (
    <div>
      <ul style={{ marginBottom: '10px' }}>
        <ListContainer>
          {currentPosts.map((post) => (
            <ListItem key={post.id} >
              <ListTitle
                onClick={() => {
                  handleNoteClick(post);
                  navigate(`/note/${post.articleId}`);
                }}
              >
                {post.articleTitle}
              </ListTitle>
            </ListItem>
          ))}
        </ListContainer>
      </ul>

      {/* 페이징 컴포넌트 추가 */}
      {totalPages > 1 && (
        <PaginationContainer>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={note.length}
            pageRangeDisplayed={5}
            prevPageText="‹"
            nextPageText="›"
            onChange={handlePageChange}
          />
        </PaginationContainer>
      )}
    </div>
  );
};

export default Paging;


const PaginationContainer = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
`;

const ListContainer = styled.div`
    padding: 2rem;
`;

const ListItem = styled.div`
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    padding: 10px;
`;

const ListTitle = styled.div`
    color: #4F4E4E;
    font-family: Noto Sans;
    font-size: 30px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;
