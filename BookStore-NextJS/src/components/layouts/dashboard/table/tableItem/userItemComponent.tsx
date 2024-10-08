'use client'

export default function UserItemComponent(props: any) {

    const { item } = props;

    console.log(item);

    return (
        <tr>
            <td>#{item.id}</td>
            <td>{item.username}</td>
            <td>{item.phone}</td>
            <td>{item.email}</td>
        </tr>
    );
};