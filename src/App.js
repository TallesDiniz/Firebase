import { useState, useEffect } from 'react';
import { db, auth } from './firebaseConnection'
import { doc, collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot} from 'firebase/firestore'
import './app.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'


function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');

  const [email, setEmail] = useState(''); 
  const [senha, setSenha] = useState(''); 

  const [user, setUser] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const [posts, setPosts] = useState([])


  useEffect(() => {
    async function loadPosts(){
     const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {  
      let listaPost = [];
      snapshot.forEach((doc) => {
        listaPost.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setPosts(listaPost);
    })  
  }
    loadPosts();
  }, [])  

  useEffect(() => { 
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          setUserDetails({
            uid: user.uid,
            email: user.email
          })
          setUser(true);
        }else{
          setUser(false);
          setUserDetails({});
        }
      })  
    }

    checkLogin(); 
  }, [])
  async function handleAdd(){
  //  await setDoc(doc(db, "posts", "12345"), {
  //    titulo: titulo,
  //    autor: autor
  //  })
  //    .then(() => {
  //      console.log("Dados registrados no banco");
  //  })
  //  .catch((error) => {
  //    console.error("Error adding document: ", error);
  //  })

  await addDoc(collection(db, "posts"), {
    titulo: titulo,
    autor: autor
  })
  .then(() => {
    console.log("Cadastardo com sucesso")
    setTitulo('');
    setAutor(''); 
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  })

}

  async function buscarPost(){
   // const postRef = doc(db, "posts", "oXWjaym1JJkn25XayRtt")

   // await getDoc(postRef)
   // .then((snapshot) => {
   //   setTitulo(snapshot.data().titulo);
   //   setAutor(snapshot.data().autor);
   // })
   // .catch((error) => {
   //   console.log("Erro ao buscar o documento: ");
   // })

   const postsRef = collection(db, "posts")
   await getDocs(postsRef)
   .then((snapshot) => {
     let lista = [];  
     snapshot.forEach((doc) => {
       lista.push({
         id: doc.id,
         ...doc.data()
       })
     })
     setPosts(lista);
  })
  .catch((error) => {
    console.log("Erro ao buscar os documentos: ");
  })
}
  async function editarPost(){
    const docRef = doc(db, "posts", idPost)
    
    await updateDoc(docRef, {
      titulo: titulo, 
      autor: autor  
    })
    .then(() => {
      console.log("Post atualizado com sucesso!")
      setIdPost('');
      setTitulo('');
      setAutor('');
    })
    .catch(() => {
      console.log("Erro ao atualizar o post: ")
    })
  }

  async function excluirPost(id){
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    .then(() => { 
      console.log("Post excluído com sucesso!")
    })
  }
    async function novoUsuario(){
      await createUserWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("Usuário cadastrado com sucesso: ", value);
        setEmail('');
        setSenha('');
      })
      .catch((error) => {
        if(error.code === 'auth/weak-password'){  
          alert("Senha muito fraca. Deve ter no mínimo 6 caracteres.")
      }else if(error.code === 'auth/email-already-in-use'){
          alert("Este email já está em uso.")
      }
    })
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("Usuário logado com sucesso: ", value.user);

      setUserDetails({
        uid: value.user.uid,
        email: value.user.email
      })
    
      setUser(true);

      setEmail('');
      setSenha('');
    })
    .catch((error) => {
      if(error.code === 'auth/wrong-password'){
        alert("Senha incorreta.")
      }else if(error.code === 'auth/user-not-found'){
        alert("Usuário não cadastrado.")
      }
    })
  }

  async function fazerLogout(){
    await signOut(auth);
    setUser(false);
    setUserDetails({});
    console.log("Usuário deslogado com sucesso!")
  }

  return (
    <div className="App">
      <h1>React JS + Firebase :) </h1>

      {user && (
        <div>
          <strong>Seja bem-vindo! Você está logado </strong> <br/> 
          <span>ID: {userDetails.uid} </span> - Email: {userDetails.email} <br/><br/>
          <button onClick={ fazerLogout }>Sair</button>
        </div>
      )}

    <div className="container">
      <h2>Área de Login</h2>

      <label>Email:</label> 
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Digite um email' /> <br/>
    
      <label>Senha:</label> 
      <input value={senha} onChange={(e) => setSenha(e.target.value)} placeholder='Digite uma senha' /> <br/>

      <button onClick={novoUsuario}>Registrar</button>  
      <button onClick={logarUsuario}>Fazer Login</button>
    </div>

    <br/><br/>
    <hr/>

      <div className='container'>
        <h2>Cadastro de Posts</h2>
        <label>ID do Post:</label>
        <input placeholder='Digite o ID do post' value={idPost} onChange={(e) => setIdPost(e.target.value)} /> <br/>

        <label>Titulo:</label>
        <textarea value={titulo} onChange={(e) => setTitulo(e.target.value)} typeof='text' placeholder='digite o titulo'/>
        
       <label>Autor:</label>
      <input type='text' value={autor} onChange={(e) => setAutor(e.target.value)} placeholder='Autor do post'/>
      
      <button onClick={handleAdd}>Cadastrar</button>
      <button onClick={buscarPost}>Buscar posts</button> <br/>

      <button onClick={editarPost}>Atualizar post</button>

      <ul>
        {posts.map((post) => {
          return (
             <li key={post.id}>
              <strong>ID: {post.id}</strong> <br/>
               <span>Titulo: {post.titulo}</span>
               <span> - Autor: {post.autor}</span> <br/>
               <button onClick={ () => excluirPost(post.id) }>Excluir</button> <br/><br/>
          </li>
        )
      })}
      </ul>
      </div>
    </div>
  );
}

export default App
