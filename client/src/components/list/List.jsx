import './list.scss'
import Card from"../card/Card"

function List({posts}) {
    if(posts.length === 0) return <p>No Posts to display.</p>
    return (
        <div className='list'>
            {posts && posts.map(item=>(
                <Card key={item.id} item={item}/>
            ))}
        </div>
    )
}

export default List